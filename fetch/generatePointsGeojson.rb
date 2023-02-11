require 'json'

@targetDir = './activities' # The directory we will read activities from

# Find all the activities and extract their points
allFeatures = []
Dir.glob("#{@targetDir}/*.json").each do |file|
    # Only interested in activities, not e.g. all.json
    if (/#{@targetDir}\/[0-9]+.json/ =~ file)
        contents = JSON.parse(File.read(file))      
        features = contents["geometry"]["coordinates"].select {|p| p != nil}.map {|p| 
            {
                :type => "Feature",
                :properties => {},
                :geometry => {
                    :type => "Point",
                    :coordinates => p
                }
            }
        }
        allFeatures.push(*features)
        puts("Loaded #{features.length} coords from #{file}")
    end
end

File.open("#{@targetDir}/allPoints.json", "w") do |file| 
    file.write({
        :type => "FeatureCollection",
        :features => allFeatures
    }.to_json)
end
