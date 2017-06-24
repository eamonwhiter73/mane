import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { URLSearchParams } from "@angular/http"
import { Platform } from 'ionic-angular';
//import { IonicImageLoader } from 'ionic-image-loader';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	items = [];
	totalCount = 0;
	lastNumRows = 0;

  constructor(public navCtrl: NavController, private http: Http, private platform: Platform) {
  	this.platform.ready().then(() => {
  		this.getInitialImages();
  	});
  }

  getInitialImages() {
		let data = new URLSearchParams();
	  data.append('page', this.totalCount.toString());
	  console.log("constructed");
 		this.http
	    .post('http://192.168.1.131:8888/maneappback/more-items.php', data)
	      .subscribe(res => {
	        for(let i=0; i<res.json().length - 1; i++) {
	        	this.totalCount+=1;
	  				this.items.push(res.json()[i]);
	  				console.log('this.items is pushed.....');
	  			};

	  			this.lastNumRows = res.json()[res.json().length - 1];
	  			console.log(this.lastNumRows)
	      }, error => {
	        console.log(JSON.stringify(error));
	      });
	}

	doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {

	    let data = new URLSearchParams();
		  data.append('page', this.totalCount.toString());

		  this.http
		    .post('http://192.168.1.131:8888/maneappback/more-items.php', data)
		      .subscribe(res => {
		      	//console.log(JSON.stringify(res));
		      	//let response = JSON.stringify(res);
		      		if(res.json()[0] == "0 results") {
		      			console.log('Async operation has ended');
		      			infiniteScroll.complete();
		      			return;
		      		}
		      		else {
				        for(let i=0; i<res.json().length - 1; i++) {
				        	this.totalCount+=1;
				        	console.log('items get pushed in more &&&*&**&&*&* \n\n\n\n\n\n\n');
				  				this.items.push(res.json()[i]);
				  			};
				  			console.log('Async operation has ended');
		      			infiniteScroll.complete();
				  		}
			  			console.log(this.totalCount + ': totalCount!!!!!!');
		      }, error => {
		          console.log(error.json());
		      });
    }, 500);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
    	let data = new URLSearchParams();
		  data.append('page', this.totalCount.toString());
		  data.append('lastNumRows', this.lastNumRows.toString());

		  console.log("constructed");

		  this.http
		    .post('http://192.168.1.131:8888/maneappback/more-items-refresher.php', data)
		      .subscribe(res => {
		      	console.log('getInitialImages completed ***********')

		      	if(res.json()[res.json().length - 1] > this.lastNumRows)

		        for(let i=0; i<res.json().length - 1; i++) {
		        	this.totalCount+=1;
		  				this.items.unshift(res.json()[i]);
		  				console.log('this.items is pushed.....');
		  			};

		  			this.lastNumRows = res.json()[res.json().length - 1];
		      }, error => {
		        console.log(JSON.stringify(error));
		      });
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
