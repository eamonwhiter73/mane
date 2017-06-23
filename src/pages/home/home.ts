import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { URLSearchParams } from "@angular/http"
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	items = [];
	totalCount = 0;

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
	    .post('http://maneapp.eamondev.com/more-items.php', data)
	      .subscribe(res => {
	      	console.log('getInitialImages completed ***********')
	        for(let i=0; i<res.json().length; i++) {
	        	this.totalCount+=1;
	  				this.items.push(res.json()[i]);
	  				console.log('this.items is pushed.....');
	  			};
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
		    .post('http://maneapp.eamondev.com/more-items.php', data)
		      .subscribe(res => {
		      	//console.log(JSON.stringify(res));
		      	//let response = JSON.stringify(res);
		      		if(res.json()[0] == "0 results") {
		      			console.log('Async operation has ended');
		      			infiniteScroll.complete();
		      			return;
		      		}
		      		else {
				        for(let i=0; i<res.json().length; i++) {
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
}
