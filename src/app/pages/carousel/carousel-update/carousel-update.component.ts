import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CarouselService} from '../../../services/carousel.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {shareReplay} from 'rxjs';
import {BannerService} from '../../../services/banner.service';
import {BannerList} from '../../../types/banner.type';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {spinnerState$$} from '../../../utils/spinner.util';
import {toast} from 'ngx-sonner';
import {MatOption, MatRipple} from '@angular/material/core';
import {MatTooltip} from '@angular/material/tooltip';
import {NgClass, NgForOf, NgOptimizedImage} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-carousel-update',
  standalone: true,
  imports: [
    MatRipple,
    RouterLink,
    MatTooltip,
    ReactiveFormsModule,
    NgClass,
    MatIcon,
    MatFormField,
    MatSelect,
    MatOption,
    NgOptimizedImage,
    NgForOf,
    MatInput,
    MatLabel
  ],
  templateUrl: './carousel-update.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselUpdateComponent implements OnInit {
  carouselEditForm: FormGroup = new FormGroup({
    id: new FormControl<string>('', Validators.required),
    bannerId: new FormControl<string>('', Validators.required),
    carouselType: new FormControl<string>('', Validators.required),
    productId: new FormControl<string | null>(null),
    orderNum: new FormControl<number | null>(null, Validators.required),
  });

  public banners = signal<BannerList[]>([]);
  public products = signal<any[]>([]);
  showProductId = signal<boolean>(true);
  private _cdr = inject(ChangeDetectorRef);
  private _router = inject(Router);
  private _bannerService = inject(BannerService);
  public carouselType = signal<string[]>([])


  #destroy = inject(DestroyRef)
  private _route = inject(ActivatedRoute);
  private _carouselId = signal<string>('')
  private _carouselService = inject(CarouselService)

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      if (params) this._carouselId.set(params['id'])
      this.getCarouselOne()
      this.getBanners();
      this.getTypesCarousel()
    })
  }


  getCarouselOne() {
    this._carouselService.carouselOne(this._carouselId()).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      this.carouselEditForm.patchValue({
        bannerId: res.banner.id,
        carouselType: res.carouselType,
        productId: res.productId,
        orderNum: res.orderNum,
        id: res.id
      })
      this.fetchCarouselType({ value: res.carouselType })
      this._cdr.detectChanges()
    })
  }

  getBanners() {
    this._bannerService.bannerList(0, 1000).pipe(
      takeUntilDestroyed(this.#destroy),
      shareReplay(1)
    ).subscribe(res => {
      if (res?.items) this.banners.set(res.items);
    });
  }

  getTypesCarousel() {
    this._carouselService.getCarouselType().pipe(
      takeUntilDestroyed(this.#destroy)
    ).subscribe(res => {
      if (res) this.carouselType.set(res);
    });
  }
  onSubmit() {
    if (this.carouselEditForm.valid) {
      spinnerState$$.next(true);
      this._carouselService.carouselUpdate(this.carouselEditForm.value).pipe(
        takeUntilDestroyed(this.#destroy)
      ).subscribe(res => {
        if (res) {
          toast.success('Изменения сохранены');
          this._router.navigate(['/carousel']);
        }
      });
    }
  }

  fetchCarouselType(event: { value: string }) {
    const productIdControl = this.carouselEditForm.get('productId');
    if (event.value === 'PRODUCT') {
      this.showProductId.set(false);
      productIdControl?.setValidators([Validators.required]);
      productIdControl?.enable();
    } else if (event.value === 'CATEGORY') {
      this.showProductId.set(true);
      productIdControl?.clearValidators();
      productIdControl?.disable();
    }

    productIdControl?.updateValueAndValidity({ emitEvent: false });
    this._cdr.detectChanges();
  }

  fetchBannerType(event: { value: string }) {
    let data = {} as BannerList | undefined;
    data = this.banners().find(el => el.id === event.value);

    this._carouselService.getCarouselProductType(
      0,
      1000,
      data?.bannerProductType.toLocaleLowerCase()
    )
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe(res => {
        if (!res) return;
        this.products.set(res.items);
      });
  }
}
