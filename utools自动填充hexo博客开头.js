var myDate = new Date()
var y = myDate.getFullYear()
var mm = myDate.getMonth()+1
var d = myDate.getDate()
var h = myDate.getHours()
var m = myDate.getMinutes()
var s = myDate.getSeconds()
const date = y+'-'+mm+'-'+d+' '+h+':'+m+':'+s
const title = '---'+'\n'+
              'title: '+'\n'+
              'categories: '+'\n'+
              'tags:'+'\n'+
              '  - '+'\n'+
              'description: '+'\n'+
              'cover: '+'\n'+
              'date: '+date+'\n'+
              '---'
utools.copyText(title)
utools.simulateKeyboardTap('v', utools.isMacOs() ? 'command' : 'ctrl')
