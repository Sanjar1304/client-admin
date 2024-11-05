import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatRipple} from '@angular/material/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgOptimizedImage} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {shareReplay} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BannerList} from '../../../types/banner.type';
import {BannerService} from '../../../services/banner.service';
import {CarouselService} from '../../../services/carousel.service';
import {MatInput} from '@angular/material/input';
import {spinnerState$$} from '../../../utils/spinner.util';
import {toast} from 'ngx-sonner';


@Component({
  selector: 'app-carousel-create',
  standalone: true,
  imports: [
    MatTooltip,
    MatIcon,
    MatRipple,
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    MatFormField,
    MatSelect,
    MatOption,
    NgOptimizedImage,
    NgForOf,
    MatLabel,
    MatInput
  ],
  templateUrl: './carousel-create.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselCreateComponent implements OnInit {
  carouselCreateForm: FormGroup = new FormGroup({
    bannerId: new FormControl<string>('', Validators.required),
    carouselType: new FormControl<string>('', Validators.required),
    productId: new FormControl<string | null>(null),
    orderNum: new FormControl<number | null>(null, Validators.required),
  })

  public banners = signal<BannerList[]>([])
  public products = signal<any>([])
  showProductId = signal<boolean>(true)
  #destroy = inject(DestroyRef)
  public carouselType = signal<string[]>([])
  private _bannerService = inject(BannerService)
  private _carouselService = inject(CarouselService)
  private _cdr = inject(ChangeDetectorRef)
  private _router = inject(Router)

  onSubmit() {
    if (this.carouselCreateForm.valid) {
      spinnerState$$.next(true)
      this._carouselService.carouselCreate(this.carouselCreateForm.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res =>{
        if (!res) return
        if (res.id) toast.success('Успешно добавлена') , this._router.navigate(['/carousel'])
      })
    }
  }

  getBanners() {
    this._bannerService.bannerList(0, 1000).pipe(
      shareReplay(1),
      takeUntilDestroyed(this.#destroy)
    ).subscribe(res => {
      if (!res?.items) return
      this.banners.set(res.items)
    })
  }

  getTypesCarousel() {
    this._carouselService.getCarouselType().pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      this.carouselType.set(res)

    })
  }

  ngOnInit(): void {
    this.getBanners()
    this.getTypesCarousel()
  }

  fetchCarouselType(event: { value: string }) {
    const productIdControl = this.carouselCreateForm.get('productId');

    if (event.value === 'PRODUCT') {
      this.showProductId.set(false);
      productIdControl?.setValidators([Validators.required]);
    } else {
      this.showProductId.set(true);
      productIdControl?.clearValidators()
    }

    productIdControl?.updateValueAndValidity({emitEvent: false});
    this._cdr.detectChanges()
  }

  fetchBannerType(event: { value: string }) {
    let data = {} as BannerList | undefined
    data = this.banners().find(el => el.id === event.value)
    this._carouselService.getCarouselProductType(0, 1000, data?.bannerProductType.toLocaleLowerCase()).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      this.products.set(res.items)

    })
  }


}


