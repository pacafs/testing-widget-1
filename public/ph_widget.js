(function() {

// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src","https://code.jquery.com/jquery-3.3.1.slim.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else { // Other browsers
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main();
}

function getParams(script_name) {
  // Find all script tags
  var scripts = document.getElementsByTagName("script");
  // Look through them trying to find ourselves
  for(var i=0; i<scripts.length; i++) {
    if(scripts[i].src.indexOf("/" + script_name) > -1) {
      // Get an array of key=value strings of params
      var pa = scripts[i].src.split("?").pop().split("&");
      // Split each key=value into array, the construct js object
      var p = {};
      for(var j=0; j<pa.length; j++) {
        var kv = pa[j].split("=");
        p[kv[0]] = kv[1];
      }
      return p;
    }
  }
  // No scripts match
  return "Script not found";
}

/******** Our main function ********/
function main() {
    jQuery(document).ready(function($) {
        // We can use jQuery 1.4.2 here
        var src_params = getParams("ph_widget.js");
        var ph_subdomain = src_params["company"];
        var score_url_final = "https://" + src_params["url"] + ".js";
        console.log(score_url_final);
        var css_link = $("<link>", {
                rel: "stylesheet",
                type: "text/css",
                href: "/survey_widget.css"
        });
        css_link.appendTo('head');
        widget_builder(ph_subdomain);
        scoreBtnHandler(score_url_final);

        setTimeout(function(){
          $('.ph_widget').animate({
            'bottom': '0px'
          }, 850, "swing", function(){

          });
        }, 200);

        $('.ph_close-widget').click(function() {
          $('.ph_widget').animate({
            'bottom': '-225px'
          }, 850, "swing", function(){
          });
        });
        // addClass("slideInUp animated");
    });
}




function scoreBtnHandler(url) {
    $(".ph_widget-score-item").on("click", function(e){
        $(".ph_widget-question, .ph_widget-score-wrapper").fadeOut('slow');
        setTimeout(function(){
          $(".ph_widget").html("\
            <h4 class='text-center ph_widget-question'>What is the most important reason for your score? (optional)</h4>\
            <div class='score__feedback-wrapper'>\
              <textarea id='ph_score-feedback' class='form-control ph_score-comment-items' placeholder='Comment' rows='1'></textarea>\
              <input id='ph_score-feedback' class='form-control ph_score-comment-items' placeholder='Your Email'></input>\
              <button class='btn btn-sm btn-success ph_score-comment-items' id='js_send-feedback'>Send Feedback</button>\
            </div>\
            <div class='ph_powered-by-wrapper2'><a href='https://producthabits.com' target='_blank'><img src='https://svgshare.com/i/6Ft.svg'></a></div>\
            <i class='zmdi zmdi-close ph_close-widget'></i>\
            ").fadeIn(1000);
            $('.ph_close-widget').click(function() {
              $('.ph_widget').animate({
                'bottom': '-225px'
              }, 850, "swing", function(){
              });
            });
        }, 500);

        // $(".ph_widget-score-wrapper").hide('slow', function() {
        // });
        //Thank you page html
        //Thank you page html
        $.ajax({
            url: url,
            type: 'post',
            data: {
                score: { score: e.target.value, feedback: null, email: null }
            },
            dataType: 'json'
        }).always(function() {
          setTimeout(function(){
            $('.ph_widget').animate({
              'bottom': '-225px'
            }, 850, "swing", function(){
            });
          }, 10000);
            // setTimeout(function(){
            //     $(".ph_widget").removeClass("slideInUp").addClass("slideOutDown");
            // }, 1000);
        });
    });
}

function widget_builder(ph_subdomain){
    var wrapper_div = document.createElement('div');
    wrapper_div.setAttribute("class", "ph_widget");
    var h3_title = document.createElement('h3');
    h3_title.innerHTML = "How likely are you to recommend <strong>" + ph_subdomain + "</strong>" + " to your friends and colleagues?"
    h3_title.setAttribute("class", "ph_widget-question");
    wrapper_div.appendChild(h3_title);
    var score_wrapper_div = document.createElement('div');
    score_wrapper_div.setAttribute("class", "ph_widget-score-wrapper");
    var ph_score_ul = document.createElement('ul');
    ph_score_ul.setAttribute("class", "ph_widget-score");
    score_wrapper_div.appendChild(ph_score_ul);
    for (i = 0; i < 11; i++) {
        var score_btn = document.createElement('li');
        score_btn.setAttribute("class", "ph_widget-score-item");
        score_btn.setAttribute("value", i);
        score_btn.innerHTML = i;
        ph_score_ul.appendChild(score_btn);
    }
    var ph_powered_by = document.createElement('div');
    ph_powered_by.setAttribute("class", "ph_powered-by-wrapper");
    var powered_by_link = document.createElement('a');
    powered_by_link.setAttribute("href", "https://producthabits.com");
    powered_by_link.setAttribute("target", "_blank");
    var powered_image = document.createElement('img');
    powered_image.setAttribute("src", "https://svgshare.com/i/6Ft.svg");
    powered_by_link.appendChild(powered_image);
    ph_powered_by.appendChild(powered_by_link);
    var ph_widget_left_label = document.createElement('div');
    ph_widget_left_label.setAttribute("class", "ph_widget-label-left");
    ph_widget_left_label.innerHTML = "Not Likely";
    ph_powered_by.setAttribute("class", "ph_powered-by-wrapper");
    var ph_widget_right_label = document.createElement('div');
    ph_widget_right_label.setAttribute("class", "ph_widget-label-right");
    ph_widget_right_label.innerHTML = "Very Likely";
    ph_score_ul.appendChild(ph_powered_by);
    ph_score_ul.appendChild(ph_widget_left_label);
    ph_score_ul.appendChild(ph_widget_right_label);
    var ph_widget_icon = document.createElement('i');
    ph_widget_icon.setAttribute("class", "zmdi zmdi-close ph_close-widget");
    wrapper_div.appendChild(ph_widget_icon);

    wrapper_div.appendChild(score_wrapper_div);
    document.body.appendChild(wrapper_div);
}

})(); // We call our anonymous function immediately
