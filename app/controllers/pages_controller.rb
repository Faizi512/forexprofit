class PagesController < ApplicationController
    def index
    end

    def submit_lead
        uri = URI("https://dukeleads.leadbyte.co.uk/api/submit.php?returnjson=yes&campid=FOREX&Email=#{params[:email]}&First_Name=#{params[:first_name]}&Last_Name=#{params[:last_name]}&Phone_1=#{params[:phone]}
        ")
        res = Net::HTTP.get_response(uri)
        puts res.body  if res.is_a?(Net::HTTPSuccess)
        redirect_to "/success"
    end

    def success
    end

    def forex_slava
        url = URI("https://platform.yourdomain.com/api/signup/procform")

        https = Net::HTTP.new(url.host, url.port)
        https.use_ssl = true

        request = Net::HTTP::Post.new(url)
        request["x-trackbox-username"] = "bilal"
        request["x-trackbox-password"] = "Life39@@"
        request["x-api-key"] = "2643889w34df345676ssdas323tgc738"
        request["Content-Type"] = "application/json"
        request.body = JSON.dump({
        "ai": "2958057",
        "ci": "1",
        "gi": "33",
        "firstname": "#{params[:firstname]}",
        "lastname": "#{params[:lastname]}",
        "email": "#{params[:email]}",
        "phone": "#{params[:phone1]}",
        "system_url": "https://tp.crtrackplatform.com"
        })

        response = https.request(request)
        puts response.read_body
    end
end
