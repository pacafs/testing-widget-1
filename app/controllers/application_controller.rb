class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :check_ip

  private

  def check_ip
    puts "YOUR IP ADDRESS IS: " + request.ip
    europe_blacklist = ['AT','BE','BG','HR','CY','CZ','DK','EE',
                        'FI','FR','DE','GR','HU','IE','IT','LV',
                        'LT','LU','MT','NL','PL','PT','RO','SK',
                        'SI','ES','SE','GB','GF','GP','MQ','ME',
                        'YT','RE','MF','GI','AX','PM','GL','BL',
                        'SX','AW','CW','WF','PF','NC','TF','AI',
                        'BM','IO','VG','KY','FK','MS','PN','SH',
                        'GS','TC','AD','LI','MC','SM','VA','JE',
                        'GG','GI']
    response = HTTParty.get('http://pro.ip-api.com/json/'+request.ip+'?key=1freiZwhIniYh5w')
    ip = europe_blacklist.any? { |e| e == response['countryCode'] }
    if ip
        puts ip
        puts response
    else
        puts "This User is Allowed!"
    end
  end
end

