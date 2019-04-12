import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper, AccountService, LoginModalService, LoginService } from 'app/core';
import { ProfileService } from '../profiles/profile.service';
import { TeamsSelectionService } from 'app/shared/teams-selection/teams-selection.service';
import { TeamsSelectionComponent } from 'app/shared/teams-selection/teams-selection.component';
import { ITeam } from 'app/shared/model/team.model';
import { IBadge } from 'app/shared/model/badge.model';
import { ILevel } from 'app/shared/model/level.model';
import { IDimension } from 'app/shared/model/dimension.model';
import { ISkill } from 'app/shared/model/skill.model';
import { BreadcrumbService } from 'app/layouts/navbar/breadcrumb.service';
import { IBreadcrumb } from 'app/shared/model/breadcrumb.model';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.scss']
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    organizationName: string;
    modalRef: NgbModalRef;
    isTeamSelectionOpen = false;

    activeLevel: ILevel;
    activeBadge: IBadge;
    activeDimension: IDimension;
    activeTeam: ITeam;
    activeSkill: ISkill;
    breadcrumbs: IBreadcrumb[];

    version: string;

    constructor(
        private accountService: AccountService,
        private breadcrumbService: BreadcrumbService,
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private modalService: NgbModal,
        private router: Router,
        private sessionStorage: SessionStorageService,
        private teamsSelectionService: TeamsSelectionService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        this.breadcrumbs = this.breadcrumbService.getCurrentBreadcrumb();
        this.breadcrumbService.breadcrumbChanged.subscribe(breadcrumb => {
            this.breadcrumbs = this.breadcrumbService.getCurrentBreadcrumb();
        });

        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
            this.organizationName = profileInfo.organization.name;
        });
        this.teamsSelectionService.query().subscribe();
    }

    loadBreadcrumb() {
        this.activeLevel = null;
        this.activeBadge = null;
        this.activeDimension = null;
        this.activeTeam = null;
        this.activeSkill = null;
        this.breadcrumbs = null;
        this.breadcrumbs = this.breadcrumbService.getCurrentBreadcrumb();
    }

    changeLanguage(languageKey: string) {
        this.sessionStorage.store('locale', languageKey);
        this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
    }

    selectTeam(): NgbModalRef {
        if (this.isTeamSelectionOpen) {
            return;
        }
        this.isTeamSelectionOpen = true;
        const modalRef = this.modalService.open(TeamsSelectionComponent, { size: 'lg' });
        modalRef.result.then(
            result => {
                this.isTeamSelectionOpen = false;
            },
            reason => {
                this.isTeamSelectionOpen = false;
            }
        );
        return modalRef;
    }

    isTeamOverview() {
        return this.activeTeam !== null && this.activeTeam !== 'undefined';
    }

    isSkillDetail() {
        return this.activeSkill !== null && this.activeSkill !== 'undfined';
    }

    get selectedTeam() {
        return this.teamsSelectionService.selectedTeam;
    }
}
