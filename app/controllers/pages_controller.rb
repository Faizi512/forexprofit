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
end
