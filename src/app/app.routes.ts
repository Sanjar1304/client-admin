import { Routes } from '@angular/router';
import {AuthorizedGuard} from './auth/guards/authorized.guard';
import {NotAuthorizedGuard} from './auth/guards/not-authorized.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'loans',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then((m) => m.AuthComponent),
    data: {animation: 'auth'},
    canActivate: [AuthorizedGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then((m) => m.ReportsComponent),
    data: {animation: 'sections'},
    canActivate: [NotAuthorizedGuard],
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      { path: 'all', loadComponent: () => import('./pages/reports/report/report.component').then((m) => m.ReportComponent) },
      { path: 'topics', loadComponent: () => import('./pages/reports/topics/topics.component').then((m) => m.TopicsComponent) },
    ],
  },
  {
    path: 'reports/create',
    loadComponent: () => import('./pages/reports/report/report-create/report-create.component').then((m) => m.ReportCreateComponent),
    data: {animation: 'reports-create'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'reports/add/section',
    loadComponent: () => import('./pages/reports/section-create/section-create.component').then((m) => m.SectionCreateComponent),
    data: {animation: 'section-create'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'reports/edit/section',
    loadComponent: () => import('./pages/reports/section-edit/section-edit.component').then((m) => m.SectionEditComponent),
    data: {animation: 'section-edit'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'transfers',
    loadComponent: () => import('./pages/transfers/transfers.component').then((m) => m.TransfersComponent),
    data: {animation: 'transfers'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'transfers/create',
    loadComponent: () => import('./pages/transfers/transfer-create/transfer-create.component').then((m) => m.TransferCreateComponent),
    data: {animation: 'transfers-create'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'loans',
    loadComponent: () => import('./pages/loans/loans.component').then((m) => m.LoansComponent),
    data: {animation: 'loans'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'loans/create',
    loadComponent: () => import('./pages/loans/loan-create/loan-create.component').then((m) => m.LoanCreateComponent),
    data: {animation: 'loans-create'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'deposits',
    loadComponent: () => import('./pages/deposits/deposits.component').then((m) => m.DepositsComponent),
    data: {animation: 'deposits'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'deposits/create',
    loadComponent: () => import('./pages/deposits/deposit-create/deposit-create.component').then((m) => m.DepositCreateComponent),
    data: {animation: 'deposits-create'},
    canActivate: [NotAuthorizedGuard]
  },

  {
    path: 'cards',
    loadComponent: () => import('./pages/cards/cards.component').then((m) => m.CardsComponent),
    data: {animation: 'cards'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'cards/create',
    loadComponent: () => import('./pages/cards/card-create/card-create.component').then((m) => m.CardCreateComponent),
    data: {animation: 'cards-create'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'carousel',
    loadComponent: () => import('./pages/carousel/carousel.component').then((m) => m.CarouselComponent),
    data: {animation: 'carousel'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'carousel/create',
    loadComponent: () => import('./pages/carousel/carousel-create/carousel-create.component').then((m) => m.CarouselCreateComponent),
    data: {animation: 'carousel-create'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'carousel/update',
    loadComponent: () => import('./pages/carousel/carousel-update/carousel-update.component').then((m) => m.CarouselUpdateComponent),
    data: {animation: 'carousel-update'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FaqComponent),
    data: {animation: 'faq'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'faq/create',
    loadComponent: () => import('./pages/faq/faq-create/faq-create.component').then((m) => m.FaqCreateComponent),
    data: {animation: 'faq-create'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'faq/update',
    loadComponent: () => import('./pages/faq/faq-update/faq-update.component').then((m) => m.FaqUpdateComponent),
    data: {animation: 'faq-update'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'banners',
    loadComponent: () => import('./pages/banners/banners.component').then((m) => m.BannersComponent),
    data: {animation: 'banners'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'banners/create',
    loadComponent: () => import('./pages/banners/create-banner/create-banner.component').then((m) => m.CreateBannerComponent),
    data: {animation: 'banners-create'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'banners/update',
    loadComponent: () => import('./pages/banners/banner-update/banner-update.component').then((m) => m.BannerUpdateComponent),
    data: {animation: 'banners-update'},
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: '**',
    redirectTo:'auth'
  }
];
