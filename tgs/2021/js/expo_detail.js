$(function(){

	var list_file = '/tgs/2021/list.json';
	var detail_file_dir = '/tgs/2021/ems_data/ems_exhibit';
	//var detail_file_dir = '/tgs/2021_ems_template/ems_exhibit';
	var select_html;


	// $.ajax({
	// 		url: list_file,
	// 			cache: false,
	// 			datatype: "json"
	// 		}).done(function(data){	
	// 			var cid='';
	// 			var id = get_query('kid');
	// 			var query_eid = get_query('eid');
	


	// 			var list_data={};

	
	// 			var docs = get_list(data,cid,query_eid);


	// 			var html = $('#list_tpl').render(docs);


	// 			$('#maplist').append(html);
				
	
				
		
				$(document).on("click","a.btn",function(){
					var id=$(this).attr("title");
					//var id=8455; //ใในใ็จ
					openWindow(id);
					
				});

				// if(id){

				// 	openWindow(id);

				// }



		
	// 		}).fail(function(data){
			
			
	// });




	function get_category_name(cid){
			if(cid){
				var cname;
			
				$.each(category_list, function(i, e) {
							
					if(e.id==cid){
						cname = e.name;
						
					}

				});
				return cname;
			}

	}


	function get_list(data){

			let rowlist;
			
			for(i=0;i<data.list.length;i++){
						let catlist=[];
						for(c=0;data.list[i].table.length>c;c++){
								if(data.list[i].table[c].id == 132 && data.list[i].table[c].rowlist.length > 0){
									catlist = data.list[i].table[c].rowlist;
								}
								if(data.list[i].table[c].id == 136 && data.list[i].table[c].rowlist.length > 0){
									catlist = data.list[i].table[c].rowlist;
								}								

						}
				
				data['list'][i]['cat'] = [];

				if(catlist.length>0){
					if(catlist[0]['cols']){
							const str= String(catlist[0]['cols']);
							data['list'][i]['cat'] = str.split(",");

					}
				}

			}

			return data;
	}



	function getDocsByExhibitKana(id,list){
			var chars = kanas[id]["search"].split("");
			var rt_docs = [];
			$.each(list, function(i, e) {
				for(var i=0; i<chars.length; i++){
					var str;
					if(lang=='ja'){ str=e.exhibitKana.substr(0, 1);}
					if(lang=='en'){ str=e.exhibitNameEn.substr(0, 1);}
					
					if(str == chars[i]){
						rt_docs.push(e);
						break;
					}
				}
			});
			return rt_docs;
	}
	function sortDocs(docs, key){
			return docs.sort(function(a, b){
			
						
				var aOrder = parseInt(a[key]);
				var bOrder = parseInt(b[key]);
					
			
				if(aOrder < bOrder) return -1;
				if(aOrder > bOrder) return 1;
				return 0;
			});
	}

	function get_kanas(key,val){
		for(var i=0; i<kanas.length; i++){
			if(kanas[i][key]==val){
				return kanas[i];
			}
		}
	}


	function openWindow(id){
		var file=detail_file_dir+'/detail_'+id+'.json';

		$.ajax({
			url: file,
			cache: false,
			datatype: "json"

		}).done(function(data){

		let rowlist=[];
		let catlist=[];
		for(i=0;data.table.length>i;i++){

				
							if(data.table[i].id == 133 && data.table[i].rowlist.length > 0){
									rowlist = data.table[i].rowlist;
							}
							if(data.table[i].id == 135 && data.table[i].rowlist.length > 0){
									rowlist = data.table[i].rowlist;
							}

							if(data.table[i].id == 132 && data.table[i].rowlist.length > 0){
									catlist = data.table[i].rowlist;
							}
							if(data.table[i].id == 136 && data.table[i].rowlist.length > 0){
									catlist = data.table[i].rowlist;
							}


		}


		let rows= [];
		
		data['cat'] = [];

		data['officialFlag'] = 0;


		if(catlist.length > 0){
			if(catlist[0]['cols']){
					const str= String(catlist[0]['cols']);
					data['cat'] = str.split(",");

					if(str.match(/ๅฌๅผๅบๅฑ็คพ็ช็ต|TGS Official Exhibitor Program/gi)){ data['officialFlag']=1; }

			}
		}



		for(i=0;rowlist.length>i;i++){
				let col={};

				col['title'] = rowlist[i]['cols'][1];
				col['En_title'] = rowlist[i]['cols'][2];

				if(rowlist[i]['cols'][11] || rowlist[i]['cols'][12] || rowlist[i]['cols'][13]){
						col['release']=true;
				}else{
						col['release']=false;
				}
				col['release01'] = rowlist[i]['cols'][11];
				col['release02'] = rowlist[i]['cols'][12];
				col['release03'] = rowlist[i]['cols'][13];

				col['titletag01'] = rowlist[i]['cols'][8];
				col['titletag02'] = rowlist[i]['cols'][9];
				col['platform'] = rowlist[i]['cols'][5];
				col['trial'] = convert_trial(rowlist[i]['cols'][15]);
				col['over'] = rowlist[i]['cols'][10];
				col['official'] = rowlist[i]['cols'][7];



				rows[i] = col;
		}


		data['rows'] =rows;
		



			var popupHtml=$('#detail_tpl').render(data);


			$.fancybox.open(popupHtml,{loop : true, toolbar  : false,smallBtn : true,animationEffect : 'zoom-in-out',transitionEffect : 'zoom-in-out'});
		}).fail(function(data){

		});
	}



	function get_query(clm){
		var strs = [];
		if(document.location.search.length > 1) {
			var q = document.location.search.substring(1);
			var params = q.split('&');
			for (var i=0; i<params.length; i++) {
				var elem = params[i].split('=');
				strs[decodeURIComponent(elem[0])] = decodeURIComponent(elem[1]).replace(/"/g, '&quot;').replace(/'/g,'&#039;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			}
		}
		if(clm){
			str=strs[clm];
		}else{
			str=strs;
		}
		if(str=== void 0){
			str='';
		}

		return str;
	}


});


function convert_trial(val){
				conf = {};
				conf['PlayStation 5'] = 'PS5';
				conf['PlayStation 4'] = 'PS4';
				conf['PlayStation VR'] = 'PS4';
				conf['Nintendo Switch'] = 'NI';
				conf['Xbox'] = 'XB';
				conf['Steam'] = 'ST';
				conf['Google Play'] = 'SP';
				conf['Browser Game'] = 'PC';
				conf['ใใฉใฆใถใฒใผใ?'] = 'PC';


				let data2=[];
				if(val){
					for(let key in conf){
						val = val.replace(key,conf[key]);

					}

					data=val.split(',');

					let flag=0;
				
					for(let i=0;data.length > i;i++){
						if(data[i] == 'PS4'){
								if(flag==0){
									data2.push(data[i]);
									flag=1;
								}
						}else{
								data2.push(data[i]);
						}
						
						
						
					}
				}
				

				return data2;
		
		
}

// ใณใณใใผใฟใผใฎๅฎ็พฉ
$.views.converters("br", function(value){
      return value.replace(/\r\n|\n|\r/g, '<br>');
});

$.views.converters("S", function(value){
			let val=value.charAt(0);

			conf = {};
			conf['ใฌ'] = 'ใซ';
			conf['ใฎ'] = 'ใญ';
			conf['ใฐ'] = 'ใฏ';
			conf['ใฒ'] = 'ใฑ';
			conf['ใด'] = 'ใณ';
			conf['ใถ'] = 'ใต';
			conf['ใธ'] = 'ใท';
			conf['ใบ'] = 'ใน';
			conf['ใผ'] = 'ใป';		
			conf['ใพ'] = 'ใฝ';		
			conf['ใ'] = 'ใฟ';		
			conf['ใ'] = 'ใ';		
			conf['ใ'] = 'ใ';		
			conf['ใ'] = 'ใ';		
			conf['ใ'] = 'ใ';		
			conf['ใ'] = 'ใ';		
			conf['ใ'] = 'ใ';		
			conf['ใ'] = 'ใ';
			conf['ใ'] = 'ใ';
			conf['ใ'] = 'ใ';
			conf['ใ'] = 'ใ';
			conf['ใ'] = 'ใ';
			conf['ใ'] = 'ใ';
			conf['ใ'] = 'ใ';
			conf['ใ'] = 'ใ';
			conf['ใฃ'] = 'ใค';
			conf['ใฅ'] = 'ใฆ';
			conf['ใง'] = 'ใจ';
			conf['ใด'] = 'ใฆ';


			for(let key in conf){
				val = val.replace(key,conf[key]);

			}


      return val;
});


$.views.converters("convertEn_platform", function(val){

			let conf = {};
			conf['Nintendo 3DS'] = '3DS';
			conf['Nintendo Switch'] = 'Switch';
			conf['PlayStation 4'] = 'PS4';
			conf['PlayStation 5'] = 'PS5';
			conf['PlayStation VR'] = 'PSVR';
			conf['Valve Index'] = 'Valve';
			conf['Oculus(Rift/Quest/Go)'] = 'Oculus';
			conf['HTC Vive'] = 'Vive';
			conf['PCใใฉใฆใถ'] = 'PC Browser';
			conf['ใใฎไป'] = 'Others';
			conf['ใใฎไป๏ผVR๏ผ'] = 'Others(VR)';
		

			for(let key in conf){
				if (val == key){
					val = val.replace(key,conf[key]);
				}
			}

		return val;
});




$.views.converters("convertEn_titletag", function(val){

			let conf = {};
			conf['ใขใฏใทใงใณ'] = 'Action';
			conf['FPSใปTPS'] = 'FPS / TPS';
			conf['RPG'] = 'RPG';
			conf['ใขใใใณใใฃใผ'] = 'Adventure';
			conf['ใณใใฅใใฑใผใทใงใณ'] = 'Communication';
			conf['ใทใฅใผใใฃใณใฐ'] = 'Shooting';
			conf['ๅฏพๆฆใปๆ?ผ้'] = 'Fighting';
			conf['ใทใใฅใฌใผใทใงใณ'] = 'Simulation';
			conf['้ณๆฅฝใปใใณใน'] = 'Music / Dance';
			conf['ในใใผใ'] = 'Sports';
			conf['ใฌใผใน'] = 'Race';
			conf['ใใบใซ'] = 'Puzzle';
			conf['ใชใขใซใฟใคใ?ในใใฉใใธใผ'] = 'Real-Time Strategy';
			conf['ใณใณในใใฉใฏใทใงใณ'] = 'Construction';
			conf['ใใผใใซใปใซใผใ'] = 'Table Game / Card Game';
			conf['ใฏใคใบ'] = 'Quiz';
			conf['ๆ่ฒใปๅฎ็จ'] = 'Education';
			conf['ใใฎไป'] = 'Others';

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;
});



$.views.converters("convertEn_over", function(val){

			let conf = {};
			conf['18ๆไปฅไธๅฏพ่ฑก'] = 'Adult-Only';
		

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;
});



$.views.converters("convertEn_release03", function(val){

			let conf = {};
			conf['ไธๆฌ'] = 'In the begging of';
			conf['ไธๆฌ'] = 'In the end of';
			conf['1ๆฅ'] = '1';
			conf['2ๆฅ'] = '2';
			conf['3ๆฅ'] = '3';
			conf['4ๆฅ'] = '4';
			conf['5ๆฅ'] = '5';
			conf['6ๆฅ'] = '6';
			conf['7ๆฅ'] = '7';
			conf['8ๆฅ'] = '8';
			conf['9ๆฅ'] = '9';
			conf['10ๆฅ'] = '10';
			conf['11ๆฅ'] = '11';
			conf['12ๆฅ'] = '12';
			conf['13ๆฅ'] = '13';
			conf['14ๆฅ'] = '14';
			conf['15ๆฅ'] = '15';
			conf['16ๆฅ'] = '16';
			conf['17ๆฅ'] = '17';
			conf['18ๆฅ'] = '18';
			conf['19ๆฅ'] = '19';
			conf['20ๆฅ'] = '20';
			conf['21ๆฅ'] = '21';
			conf['22ๆฅ'] = '22';
			conf['23ๆฅ'] = '23';
			conf['24ๆฅ'] = '24';
			conf['25ๆฅ'] = '25';
			conf['26ๆฅ'] = '26';
			conf['27ๆฅ'] = '27';
			conf['28ๆฅ'] = '28';
			conf['29ๆฅ'] = '29';
			conf['30ๆฅ'] = '30';
			conf['31ๆฅ'] = '31';

		

			for(let key in conf){
				if (val == key){
					val = val.replace(key,conf[key]);
				}
			}

		return val;
});

$.views.converters("convertEn_release02", function(val){

			let conf = {};
			conf['ๆฅ'] = 'Spring';
			conf['ๅค'] = 'Summer';
			conf['็ง'] = 'Autumn';
			conf['ๅฌ'] = 'Winter';
			conf['ไปๅฌ'] = 'This Winter';
			conf['ๅ้?ญ'] = 'Beginning';
			conf['1ๆ'] = 'Jan.';
			conf['2ๆ'] = 'Feb.';
			conf['3ๆ'] = 'Mar.';
			conf['4ๆ'] = 'Apr.';
			conf['5ๆ'] = 'May.';
			conf['6ๆ'] = 'Jun.';
			conf['7ๆ'] = 'Jul.';
			conf['8ๆ'] = 'Aug.';
			conf['9ๆ'] = 'Sep.';
			conf['10ๆ'] = 'Oct.';
			conf['11ๆ'] = 'Nov.';
			conf['12ๆ'] = 'Dec.';

			for(let key in conf){
				if (val == key){
					val = val.replace(key,conf[key]);
				}
			}

		return val;
});

$.views.converters("convertEn_release01", function(val){

			let conf = {};
			conf['ๆชๅฎ'] = 'Undecided';
			conf['็บๅฃฒไธญ'] = 'On sale';
			conf['้ไฟกไธญ'] = 'Being Distributed';
			conf['2021ๅนด'] = '2021';
			conf['2022ๅนด'] = '2022';

			for(let key in conf){
				if (val == key){
					val = val.replace(key,conf[key]);
				}
			}

		return val;
});


$.views.converters("convertEn_cat", function(val){

			let conf = {};
			conf['ๅฌๅผๅบๅฑ็คพ็ช็ต'] = 'TGS Official Exhibitor Program';
			conf['Amazon็น่จญไผๅ?ด'] = 'Amazon.co.jp Special Venue';
			conf['ใชใขใซๅฑ็คบ'] = 'Physical Exhibition';
			conf['ใชใณใฉใคใณไฝ้จใใขใผ'] = 'Online Experience Tour';
			conf['TGS2021 VR'] = 'TGS2021 VR';
			conf['TOKYO GAME MUSIC FES'] = 'TOKYO GAME MUSIC FES';
			conf['ใใธใในใปใใใผ'] = 'Business Seminar';
			conf['ใใฌใผใณใไผ็ป'] = 'Present/Give-away Project';
			conf['e-ในใใผใ'] = 'e-Sports';
			conf['ๅฃฐๅชใปใฟใฌใณใ'] = 'Voice Actor/Talent';
			conf['ๅญไพใปใใกใใชใผ'] = 'Kids/Family';

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;
});


$.views.converters("convertEn_trial", function(val){

			let conf = {};
			conf['ใใฉใฆใถใฒใผใ?'] = 'Browser Game';
		

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;

});





///ๆฅๆฌ่ชๅคๆ

$.views.converters("convertJa_platform", function(val){

			conf = {};
			conf['Nintendo 3DS'] = '3DS';
			conf['Nintendo Switch'] = 'Switch';
			conf['PlayStation 4'] = 'PS4';
			conf['PlayStation 5'] = 'PS5';
			conf['PlayStation VR'] = 'PSVR';
			conf['Valve Index'] = 'Valve';
			conf['Oculus(Rift/Quest/Go)'] = 'Oculus';
			conf['HTC Vive'] = 'Vive';
			conf['PC Browser'] = 'PCใใฉใฆใถ';
			conf['Others'] = 'ใใฎไป';
			conf['Others(VR)'] = 'ใใฎไป๏ผVR๏ผ';



			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;
});



$.views.converters("convertJa_cat", function(val){

			let conf = {};
			conf['TGS Official Exhibitor Program'] = 'ๅฌๅผๅบๅฑ็คพ็ช็ต';
			conf['Amazon.co.jp Special Venue'] = 'Amazon็น่จญไผๅ?ด';
			conf['Physical Exhibition'] = 'ใชใขใซๅฑ็คบ';
			conf['Online Experience Tour'] = 'ใชใณใฉใคใณไฝ้จใใขใผ';
			conf['TGS2021 VR'] = 'TGS2021 VR';
			conf['TOKYO GAME MUSIC FES'] = 'TOKYO GAME MUSIC FES';
			conf['Business Seminar'] = 'ใใธใในใปใใใผ';
			conf['Present/Give-away Project'] = 'ใใฌใผใณใไผ็ป';
			conf['e-Sports'] = 'e-ในใใผใ';
			conf['Voice Actor/Talent'] = 'ๅฃฐๅชใปใฟใฌใณใ';
			conf['Kids/Family'] = 'ๅญไพใปใใกใใชใผ  ';

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;


});


$.views.converters("convertJa_release01", function(val){

			let conf = {};
			conf['Undecided']='ๆชๅฎ';
			conf['On sale']='็บๅฃฒไธญ';
			conf['Being Distributed']='้ไฟกไธญ';
			conf['2021']='2021ๅนด';
			conf['2022']='2022ๅนด';

			for(let key in conf){
				if (val == key){
					val = val.replace(key,conf[key]);
				}

			}

		return val;
});


$.views.converters("convertJa_release02", function(val){

			let conf = {};
			conf['Spring'] = 'ๆฅ';
			conf['Summer'] = 'ๅค';
			conf['Autumn'] = '็ง';
			conf['Winter'] = 'ๅฌ';
			conf['This Winter'] = 'ไปๅฌ';
			conf['Beginning'] = 'ๅ้?ญ';
			conf['Jan.'] = '1ๆ';
			conf['Feb.'] = '2ๆ';
			conf['Mar.'] = '3ๆ';
			conf['Apr.'] = '4ๆ';
			conf['May.'] = '5ๆ';
			conf['Jun.'] = '6ๆ';
			conf['Jul.'] = '7ๆ';
			conf['Aug.'] = '8ๆ';
			conf['Sep.'] = '9ๆ';
			conf['Oct.'] = '10ๆ';
			conf['Nov.'] = '11ๆ';
			conf['Dec.'] = '12ๆ';

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;
});


$.views.converters("convertJa_release03", function(val){

			let conf = {};
			conf['In the begging of']='ไธๆฌ';
			conf['In the end of']='ไธๆฌ';
			conf['1']='1ๆฅ';
			conf['2']='2ๆฅ';
			conf['3']='3ๆฅ';
			conf['4']='4ๆฅ';
			conf['5']='5ๆฅ';
			conf['6']='6ๆฅ';
			conf['7']='7ๆฅ';
			conf['8']='8ๆฅ';
			conf['9']='9ๆฅ';
			conf['10']='10ๆฅ';
			conf['11']='11ๆฅ';
			conf['12']='12ๆฅ';
			conf['13']='13ๆฅ';
			conf['14']='14ๆฅ';
			conf['15']='15ๆฅ';
			conf['16']='16ๆฅ';
			conf['17']='17ๆฅ';
			conf['18']='18ๆฅ';
			conf['19']='19ๆฅ';
			conf['20']='20ๆฅ';
			conf['21']='21ๆฅ';
			conf['22']='22ๆฅ';
			conf['23']='23ๆฅ';
			conf['24']='24ๆฅ';
			conf['25']='25ๆฅ';
			conf['26']='26ๆฅ';
			conf['27']='27ๆฅ';
			conf['28']='28ๆฅ';
			conf['29']='29ๆฅ';
			conf['30']='30ๆฅ';
			conf['31']='31ๆฅ';

		

			for(let key in conf){
				if (val == key){
					val = val.replace(key,conf[key]);
				}
			}

		return val;
});


$.views.converters("convertJa_titletag", function(val){

			let conf = {};
			conf['Action']='ใขใฏใทใงใณ ';
			conf['FPS / TPS']='FPSใปTPS';
			conf['RPG']='RPG';
			conf['Adventure']='ใขใใใณใใฃใผ';
			conf['Communication']='ใณใใฅใใฑใผใทใงใณ';
			conf['Shooting']='ใทใฅใผใใฃใณใฐ';
			conf['Fighting']='ๅฏพๆฆใปๆ?ผ้';
			conf['Simulation']='ใทใใฅใฌใผใทใงใณ';
			conf['Music / Dance']='้ณๆฅฝใปใใณใน';
			conf['Sports']='ในใใผใ';
			conf['Race']='ใฌใผใน';
			conf['Puzzle']='ใใบใซ';
			conf['Real-Time Strategy']='ใชใขใซใฟใคใ?ในใใฉใใธใผ';
			conf['Construction']='ใณใณในใใฉใฏใทใงใณ';
			conf['Table Game / Card Game']='ใใผใใซใปใซใผใ';
			conf['Quiz']='ใฏใคใบ';
			conf['Education']='ๆ่ฒใปๅฎ็จ';
			conf['Others']='ใใฎไป';

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;
});



$.views.converters("convertJa_over", function(val){

			let conf = {};
			conf['Adult-Only'] = '18ๆไปฅไธๅฏพ่ฑก';
		

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;
});


$.views.converters("convertJa_trial", function(val){

			let conf = {};
			conf['Browser Game'] = 'ใใฉใฆใถใฒใผใ?';
		

			for(let key in conf){
				val = val.replace(key,conf[key]);

			}

		return val;

});
