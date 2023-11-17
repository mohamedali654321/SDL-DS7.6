import { Component ,Input  } from '@angular/core';
import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { SubmissionService } from 'src/app/submission/submission.service';
import { SubmissionObject } from 'src/app/core/submission/models/submission-object.model';
import { isNotEmpty, isNotNull } from 'src/app/shared/empty.util';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.reducer'; //kware-edit
import { select, Store } from '@ngrx/store'; //kware-edit
import { isAuthenticated } from 'src/app/core/auth/selectors'; //kware-edit
import { Observable } from 'rxjs';
@Component({
  selector: 'ds-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent {
  isAuthorized$: Observable<boolean>;  //kware-edit
  images = [
  
    {
      id:'d41723d0-7406-4336-b61c-d62769bb2133',
      imageSrc:'/assets/dspace/images/1066576_485053.jpg',
      title: 'home.news.title.manuscript',
      url:'https://repo-imamu.dev.kwaretech.com/collections/d41723d0-7406-4336-b61c-d62769bb2133',
      desc:'home.news.desc.manuscript'
    },
    {
      id:'66509666-c1e5-46d8-bd81-6397ca6f8607',
      imageSrc:'/assets/dspace/images/Theses.png',
      title: 'home.news.title.theises',
      url:'https://repo-imamu.dev.kwaretech.com/collections/66509666-c1e5-46d8-bd81-6397ca6f8607',
      desc:'home.news.desc.theises',
         
     },

    {
      id:'7121fa0c-084e-4d6b-b31a-7c5e7fb27d45',
      imageSrc:'/assets/dspace/images/istockphoto-1140728159-612x612.jpg',
      title: 'home.news.title.article',
      url:'https://repo-imamu.dev.kwaretech.com/collections/7121fa0c-084e-4d6b-b31a-7c5e7fb27d45',
      desc:'home.news.desc.article'     },
    
  ];

  constructor( private submissionService: SubmissionService,private router: Router,public store: Store<AppState>){super();}
  @Input() showScopeSelector = true;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isAuthorized$ = this.store.pipe(select(isAuthenticated)); //kware-edi
  }

  createSubmissionFormById(id: string){
    this.submissionService.createSubmission(id)
    .subscribe((submissionObject: SubmissionObject) => {
      if (isNotNull(submissionObject)) {
        if (isNotEmpty(submissionObject) && this.isAuthorized$) {
         this.router.navigate(['/workspaceitems/',submissionObject?.id,'edit']);
      }
      else{
        this.router.navigate(['login'])
      }
    }})
  }
}

