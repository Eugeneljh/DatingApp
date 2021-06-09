import { Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Directive } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]' // *appHasRole='[]'
})
export class HasRoleDirective implements OnInit{
  @Input() appHasRole: string[];
  user: User;

  constructor(private viewContainerRef: ViewContainerRef, 
    private templateRef: TemplateRef<any>, 
    private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
      })
     }
  ngOnInit(): void {
    // Clear view if no roles
    if (!this.user.role || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }
    // some() -> Apply call back function on each element inside the user roles
    // if user is in specified role, embeddedview creates the templateRef which in this case
    // will be the 'Admin' link
    if (this.user?.role.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
