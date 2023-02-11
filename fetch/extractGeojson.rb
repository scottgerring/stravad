require 'bundler/setup'
require 'polylines'
require 'json'
require 'strava-ruby-client'
require 'date'
require 'readline'


# Strava API client credentials
clientId = ENV["STRAVA_CLIENT_ID"]
clientSecret = ENV["STRAVA_CLIENT_SECRET"]
refreshToken = ENV["STRAVA_REFRESH_TOKEN"]

if clientId == nil or clientSecret == nil or refreshToken == nil then 
    puts("Need to set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and STRAVA_REFRESH_TOKENenv vars")
    exit(false)
end

# Where are we writing to?
if ARGV.length != 1 then
    puts("Usage: extractGeojson.rb /output-path/")
    exit(-1)
end
basePath = ARGV[0]
if not Dir.exists?(basePath) then
    puts("Directory #{basePath} doesn't exist")
    exit(-1)
end

# Make sure our output directories are there
targetDir = "#{basePath}/activities" # Where to output activities to
completeTargetDir = "#{basePath}/activities-complete" # Where to output complete activities to
if not Dir.exists?(targetDir) then 
    puts("Creating #{targetDir}")
    Dir.mkdir(targetDir)
end 
if not Dir.exists?(completeTargetDir) then 
    puts("Creating #{completeTargetDir}")
    Dir.mkdir(completeTargetDir)
end 


# Authenticate!
client = Strava::OAuth::Client.new(
    client_id: clientId,
    client_secret: clientSecret
)   

# Fetch access token from refresh token 
puts "Retrieving access token from refresh token"
auth = client.oauth_token(
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
)
accessToken = auth["access_token"]
puts "Access token: #{accessToken}"

# Setup a new client with our access token for the user
newClient = Strava::Api::Client.new(    
    access_token: accessToken,
  )

# Fetch
allActivities = []
newClient.athlete_activities(per_page: 100) do |activity|
    allActivities.push(activity)
end
puts "Activity count: #{allActivities.length}"


# Fetch all of the activities
activityGeojson = allActivities.map do |activity|
    targetFile = "#{targetDir}/#{activity['id']}.json"
    if (!File.exist?(targetFile)) then
        puts "Should download #{targetFile}"

        # Get the encoded polyline
        fullActivity = nil
        begin
            fullActivity = newClient.activity(activity['id'])
        rescue Strava::Errors::RatelimitError => e
            puts("Strava rate limit hit; backing off for 5 minutes")
            puts(e)
            sleep(300)
            retry 
        end

        polyline = fullActivity["map"]["polyline"]        

        # Decode it to an array of points
        geojson = {}
        if (polyline) then
            points = Polylines::Decoder.decode_polyline(polyline)
            points = points.map { |p| [p[1], p[0]] }

            # Encode it to geojson
            geojson = {
                :type => "Feature",
                :properties => {
                    :id => activity["id"],
                    :name => activity["name"],
                    :activity_type => activity["sport_type"],
                    :start_date => activity["start_date"],
                    :distance_meters => activity["distance"],
                    :elevation_gain_meters => activity["total_elevation_gain"],
                    :elapsed_time_seconds => activity["elapsed_time"],
                    :moving_time_seconds => activity["moving_time"],
                    :start_lat_long => activity["start_latlng"],
                    :end_lat_long => activity["end_latlng"],
                    :average_heartrate => activity["average_heartrate"],
                    :max_heartrate => activity["max_heartrate"],
                    :average_speed => activity["average_speed"],
                    :max_speed => activity["max_speed"],
                    :country => activity["location_country"]

                },
                :geometry => {
                    :type => "LineString",
                    :coordinates => points
                }
            }
            File.open(targetFile, 'w') do |file| 
                file.write(geojson.to_json())
            end
            geojson
        end

        # Fetch streams, them munge together with GeoJSON for complete record
        date_part = activity["start_date"].strftime('%Y-%m-%d')
        completeTargetFile = "#{completeTargetDir}/#{date_part}-#{activity['id']}.json"
        
        # Fetch the streams 
        streams = nil 
        begin
            streams = newClient.activity_streams(activity['id'], keys: %w[heartrate, latlng, time, cadence, temp, altitude, watts])
        rescue Strava::Errors::RatelimitError => e
            puts("Strava rate limit hit; backing off for 5 minutes")
            sleep(300)
            retry 
        end

        completeRecord = {
            streams: streams,
            geojson: geojson
        }
        File.open(completeTargetFile, 'w') do |file| 
            file.write(completeRecord.to_json())
        end


    end
end

# Combine it all into one feature collection and write it out
outputGeojson = {
    :type => "FeatureCollection",
    :features => activityGeojson.select { |f| f != nil }
}

File.open("#{targetDir}/all.json", 'w') do |file|
    file.write(outputGeojson.to_json)
end
