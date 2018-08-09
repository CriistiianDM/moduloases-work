'use strict';define(['jquery','block_ases/bootstrap','block_ases/sweetalert','block_ases/jqueryui','block_ases/select2'],function(a){return{init:function init(){function g(l,m){if('seguimiento_pares'==m){for(var n=l.length,o=0;o<n;o++){for(var r=null,s=null,v=0;v<Object.keys(l[o]).length;v++)'-#$%-'==l[o][v].respuesta&&(l[o][v].respuesta=''),('puntuacion_riesgo_individual'==l[o][v].local_alias||'puntuacion_riesgo_familiar'==l[o][v].local_alias||'puntuacion_riesgo_academico'==l[o][v].local_alias||'puntuacion_riesgo_economico'==l[o][v].local_alias||'puntuacion_vida_uni'==l[o][v].local_alias)&&('1'==l[o][v].respuesta?l[o][v].respuesta='bajo':'2'==l[o][v].respuesta?l[o][v].respuesta='medio':'3'==l[o][v].respuesta&&(l[o][v].respuesta='alto')),'revisado_profesional'==l[o][v].local_alias&&('0'==l[o][v].respuesta?l[o][v].respuesta='marcado':'-1'==l[o][v].respuesta&&(l[o][v].respuesta='no_marcado')),'revisado_practicante'==l[o][v].local_alias&&('0'==l[o][v].respuesta?l[o][v].respuesta='marcado':'-1'==l[o][v].respuesta&&(l[o][v].respuesta='no_marcado')),r&&s||('id_estudiante'==l[o][v].local_alias&&(r=l[o][v].respuesta),'id_creado_por'==l[o][v].local_alias&&(s=l[o][v].respuesta));var w=parseInt(a('#dphpforms-instance-id').data('instance-id'));a.ajax({type:'POST',url:'../managers/user_management/user_management_api.php',data:JSON.stringify({'function':'get_crea_stud_mon_prac_prof',params:[r,s,w]}),contentType:'application/json; charset=utf-8',dataType:'json',async:!1,success:function success(B){l[o][Object.keys(l[o]).length]={enunciado:'monitor_name',id:'00',local_alias:'monitor_name',respuesta:B.data_response.monitor.firstname+''+' '+(B.data_response.monitor.lastname+'')},l[o][Object.keys(l[o]).length]={enunciado:'practicing_name',id:'00',local_alias:'practicing_name',respuesta:B.data_response.practicing.firstname+''+' '+(B.data_response.practicing.lastname+'')},l[o][Object.keys(l[o]).length]={enunciado:'professional_name',id:'00',local_alias:'professional_name',respuesta:B.data_response.professional.firstname+''+' '+(B.data_response.professional.lastname+'')},l[o][Object.keys(l[o]).length]={enunciado:'created_by',id:'00',local_alias:'created_by',respuesta:B.data_response.created_by.firstname+''+' '+(B.data_response.created_by.lastname+'')};var C=B.data_response.student_username;C=C?B.data_response.student_username.split('-')[0]:'null',l[o][Object.keys(l[o]).length]={enunciado:'student_code',id:'00',local_alias:'student_code',respuesta:C},l[o][Object.keys(l[o]).length]={enunciado:'student_firstname',id:'00',local_alias:'student_firstname',respuesta:B.data_response.student.firstname+''},l[o][Object.keys(l[o]).length]={enunciado:'student_lastname',id:'00',local_alias:'student_lastname',respuesta:B.data_response.student.lastname+''}},failure:function failure(B){console.log(B)}});for(var A=Object.keys(l[o]).length-1;0<=A;A--)l[o][A+3]=a.extend(!0,{},l[o][A]);l[o][0]=a.extend(!0,{},l[o][Object.keys(l[o]).length-3]),l[o][1]=a.extend(!0,{},l[o][Object.keys(l[o]).length-2]),l[o][2]=a.extend(!0,{},l[o][Object.keys(l[o]).length-1]),delete l[o][Object.keys(l[o]).length-1],delete l[o][Object.keys(l[o]).length-1],delete l[o][Object.keys(l[o]).length-1]}return l}return l}function h(l){var m,n,o,p,q,r;if(r=l.data||null,null==r||!r.length)return null;p=l.columnDelimiter||',',q=l.lineDelimiter||'\n',o=Object.keys(r[0]);for(var s=[],u=0;u<Object.keys(r[0]).length;u++)try{s.push(r[0][u].local_alias)}catch(v){console.log('ERROR'),console.log(r[0])}return m='',m+=s.join(p),m+=q,r.forEach(function(v){n=0,o.forEach(function(w){0<n&&(m+=p);try{m+='"'+v[w].respuesta.replace(/"/g,'\'')+'"'}catch(z){}n++}),m+=q}),m}function j(l){var m,n,o=h({data:l});if(null!=o){m='reporte.csv',csvData=new Blob([o],{type:'text/csv'});var n=document.createElement('a');if(void 0!==n.download){var p=URL.createObjectURL(csvData);n.setAttribute('href',p),n.setAttribute('download',m),n.style='visibility:hidden',document.body.appendChild(n),n.click(),document.body.removeChild(n)}}}a('#btn-generar-reporte').click(function(){var l=a('#start_date').val(),m=a('#end_date').val();if(l>=m)swal({title:'Informaci\xF3n',text:'Intervalo de fechas inv\xE1lido',type:'warning'},function(){});else{var n=JSON.parse(a('#dphpforms-reports-preguntas').html());a('.progress-bar').width('0%'),a('.progress-bar').html('0%'),a('.progress-bar').attr('aria-valuenow','0'),a('#progress_group').css('display','block'),a('#message').removeClass('alert alert-success'),a('#message').addClass('alert alert-info'),a('#message').html('<strong>Info!</strong> Se est\xE1 generando el reporte, esto puede tardar un par de minutos dependiendo de su conexi\xF3n a internet, capacidad del ordenador y rapidez del campus virtual.'),a.get('../managers/dphpforms/dphpforms_reverse_filter.php?id_pregunta=seguimiento_pares_fecha&cast=date&criterio={"criteria":[{"operator":">=","value":"'+l+'"},{"operator":"<=","value":"'+m+'"}]}',function(o){for(var p=Object.keys(o.results).length,q=[],r=0,s=0;s<p;s++)a.get('../managers/dphpforms/dphpforms_reverse_finder.php?respuesta_id='+o.results[s].id,function(u){a.get('../managers/dphpforms/dphpforms_get_record.php?record_id='+u.result.id_registro,function(v){if(0<Object.keys(v.record).length){for(var w=a.extend(!0,{},n),z=0;z<Object.keys(v.record.campos).length;z++)for(var A=0;A<Object.keys(w).length;A++)w[A].id==parseInt(v.record.campos[z].id_pregunta)&&(w[A].respuesta=v.record.campos[z].respuesta);q.push(w)}r++,a('.progress-bar').width((100/p*r).toFixed(0)+'%'),a('.progress-bar').html((100/p*r).toFixed(0)+'%'),a('.progress-bar').attr('aria-valuenow',(100/p*r).toFixed(0)),r==p&&(a('#message').removeClass('alert alert-info'),a('#message').addClass('alert alert-success'),a('#message').html('<strong>Info!</strong>  Reporte generado.'),j(g(q,'seguimiento_pares')))}).fail(function(v){console.log(v)})}),a('#progress').text(Math.round(r));0==p&&(a('#progress').text(100),a('#message').removeClass('alert alert-info'),a('#message').addClass('alert alert-success'),a('#message').html('<strong>Info!</strong>  Reporte generado.'))})}})}}});