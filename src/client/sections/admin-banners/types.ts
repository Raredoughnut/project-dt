/** 배너 폼 초기값(편집 모드). 뷰가 받는 프레젠테이션용 계약. */
export interface BannerMetaInitial {
  title: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
  imageUrl: string;
  mobileImageUrl: string | null;
}
