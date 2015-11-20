/**
 * YZT Login Module
 * @require login.js
 */
require.config({
    baseUrl: '/app_js/wanlitong/v40/wap/',
    paths: {
        'Zepto': 'vendor/zepto/zepto.min',
        'md5': 'vendor/CryptoJS/rollups/md5',
        'sha1': 'vendor/CryptoJS/rollups/sha1',
        'wlt': 'vendor/WLT/wlt',
        'wlt.popup': 'vendor/WLT/wlt.popup',
        'wlt.util': 'vendor/WLT/wlt.util',
        'wlt.util.sign': 'vendor/WLT/util/sign',
        'util.common': 'vendor/WLT/util/sign/common',
        'util.date': 'vendor/WLT/util/date'
    },
    shim: {
        'Zepto': {
            exports: '$'
        },
        'sha1': {
            exports: 'CryptoJS'
        },        
        'md5': {
            exports: 'CryptoJS'
        },
        'wlt': {
            deps: ['Zepto']
        },
        'wlt.popup': {
            deps: ['wlt']
        },
        'wlt.util': {
            deps: ['wlt']
        },
        'util.date': {
            deps: ['wlt.util']
        },
        'wlt.util.sign': {
            deps: ['wlt.util']
        },
    }
});

define(function(require, exports, module) {
    var $ = require('Zepto');
    require('md5');
    require('sha1');
    require('util.date');
    require('util.common');
    
    //YZT API
    //var YZT_BASE_DOMAIN = 'https://member.pingan.com.cn';
    var YZT_BASE_DOMAIN = 'https://test-member.pingan.com.cn';
    var YZT_API_MERGE_LOGIN = YZT_BASE_DOMAIN + '/pinganone/pa/mergeLogin.view';
    
    //WLT API
    var BASE_DOMAIN = '';
    var API_GET_SERVER_TIME = '/mobileapi/getServerTime.do';
    var PRIVATE_KEY = '09FB84B1-D90E-4C14-84DB-DEE924A87B51';
    
    var APP_ID = '10060';
    
    var signGen = function(o) {
        var sign = '',
            s = PRIVATE_KEY + 'appId=' + o.appId + '&timestamp=' + o.timestamp + PRIVATE_KEY;
        sign = CryptoJS.MD5(s).toString();
        return sign;
    };
    
    WLT.module.login.yzt = function(url) {
        var ts = WLT.util.date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        var pDate = {
            authType: 'SHA1',
            timestamp: ts
        };
        $.extend(pDate, {
            sign: WLT.util.sign.common(pDate)
        });
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: API_GET_SERVER_TIME,
            data: pDate,
            success: function(res) {
                if(!res) {
                    WLT.popup({
                        msg: '未知错误!'
                    });
                    return;
                }
                var timestamp = res.result;
                
                var callbackUrl = url ? encodeURIComponent(url) : '';
                
                //form submit data
                var pLogin = {
                    appId: APP_ID,
                    signtype: 'MD5',
                    timestamp: timestamp,
                    paramType: 'app',
                    ptag: callbackUrl
                };
                $.extend(pLogin, {
                    signature: signGen(pLogin)
                });
                
                //generate submit form
                var tpl_form = '<form action="" method="POST"></form>',
                    tpl_hidden = '<input type="hidden" name="" value="" />';
                
                var elForm = $(tpl_form);
                elForm.attr('action', YZT_API_MERGE_LOGIN);
                
                for(var k in pLogin) {
                    var elHidden = $(tpl_hidden);
                    elHidden.attr('name', k);
                    elHidden.val(pLogin[k]);
                    elForm.append(elHidden);
                }
                
                $(document.body).append(elForm);
                elForm.submit();
                elForm.remove();
            },
            error: function() {
                WLT.popup({
                    msg: '请求失败！'
                });
            }
        });
    };
});
