import { Component, Input } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpResponse
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Item } from 'src/app/core/shared/item.model';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'ds-view-statistics',
  templateUrl: './view-statistics.component.html',
  styleUrls: ['./view-statistics.component.scss']
})
export class ViewStatisticsComponent {

  @Input() object: Item;
  TotalVisits = new BehaviorSubject<number>(0);
  TotalDownloads = new BehaviorSubject<number>(0);
  constructor(private httpClient: HttpClient,){}

  ngOnInit(): void {
    this.getStatistics().then(statistic=>{
      statistic.subscribe(res=>{
       res._embedded.usagereports.filter(visit=>{visit['report-type'] == 'TotalVisits' ? this.TotalVisits.next(visit.points[0].values.views)  : null})
       res._embedded.usagereports.filter(download=>{download['report-type'] == 'TotalDownloads' ? download.points.forEach(values=>{
        this.TotalDownloads.next(this.TotalDownloads.getValue()+values.values.views );
       }) : null})

      //  res._embedded.usagereports.filter(download=>{download['report-type'] == 'TotalDownloads' ? this.TotalDownloads.next(download.points[0].values.views) : null})
      })
     })
  }
  async getStatistics(): Promise<any>{
    const  data= await this.httpClient.get(`${environment.rest.baseUrl}/api/statistics/usagereports/search/object?uri=${environment.rest.baseUrl}/api/core/item/${this.object.uuid}`);
     return await data;
 
   }
}
