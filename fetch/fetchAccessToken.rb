require 'bundler/setup'
require 'polylines'
require 'json'
require 'strava-ruby-client'
require 'date'
require 'readline'

# Strava API client credentials
@clientId = ENV["STRAVA_CLIENT_ID"]
@clientSecret = ENV["STRAVA_CLIENT_SECRET"]

if @clientId == nil or @clientSecret == nil then 
    puts("Need to set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET env vars")
    exit(false)
end

# Authenticate!
client = Strava::OAuth::Client.new(
    client_id: @clientId,
    client_secret: @clientSecret
)   
# URL required to get the auth code
authUrl = "https://www.strava.com/oauth/authorize?" + 
"client_id=#{@clientId}" + 
"&response_type=code&redirect_uri=http://localhost&scope=view_private&state=mystate&approval_prompt=force&scope=activity:read_all";
puts authUrl
puts "Provide the response code from the 'code' parameter of the redirected URL: "
clientCode = Readline.readline()
puts "Retrieving access token from client code '#{clientCode}'"
@auth = client.oauth_token(code: clientCode)
refreshToken = @auth["refresh_token"]
puts "Refresh token: #{refreshToken}"
