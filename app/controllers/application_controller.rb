class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :check_user_ip

  private

  def check_user_ip
    if check_ip
        head :ok, content_type: "text/html"
    end
  end

  def check_ip
    return cookies['AllowUserIP'] unless cookies['AllowUserIP'].blank?
    europe_blacklist = ['AT','BE','BG','HR','CY','CZ','DK','EE',
                        'FI','FR','DE','GR','HU','IE','IT','LV',
                        'LT','LU','MT','NL','PL','PT','RO','SK',
                        'SI','ES','SE','GB','GF','GP','MQ','ME',
                        'YT','RE','MF','GI','AX','PM','GL','BL',
                        'SX','AW','CW','WF','PF','NC','TF','AI',
                        'BM','IO','VG','KY','FK','MS','PN','SH',
                        'GS','TC','AD','LI','MC','SM','VA','JE',
                        'GG','GI']
    response = HTTParty.get('http://pro.ip-api.com/json/'+request.remote_ip+'?key=1freiZwhIniYh5w')
    ip = europe_blacklist.any? { |e| e === response['countryCode'] }
    ip ? cookies['AllowUserIP'] = false : cookies['AllowUserIP'] = true
  end
end

