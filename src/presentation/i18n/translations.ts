export type Locale = "ko" | "ja";

export type LogisticsTooltipKey =
  | "recentShipments"
  | "seasonalityIndex"
  | "leadTime"
  | "turnoverDays"
  | "suggestedOrderQty";

export interface TooltipEntry {
  title: string;
  description: string;
}

export interface TranslationDict {
  localeLabels: Record<Locale, string>;
  languageSelectorAria: string;
  dashboard: {
    systemName: string;
    title: string;
    subtitle: string;
    logout: string;
    registerProduct: string;
    closeRegisterForm: string;
    loadingProducts: string;
    statOrder: string;
    statNormal: string;
    statWarning: string;
    statAGrade: string;
    confirmDelete: string;
    errors: {
      fetchFailed: string;
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
    };
  };
  search: {
    label: string;
    placeholder: string;
  };
  table: {
    empty: string;
    abc: string;
    barcode: string;
    productName: string;
    unitPrice: string;
    currentStock: string;
    adjustedDailyShipment: string;
    turnoverDays: string;
    stockStatus: string;
    suggestedOrderQty: string;
    actions: string;
    coreProduct: string;
    viewDetail: string;
    delete: string;
    pageSizeLabel: string;
    pageSizeOption: (size: number) => string;
    paginationRange: (start: number, end: number, total: number) => string;
    paginationOrdinal: string;
    previous: string;
    next: string;
    sortBy: (label: string) => string;
    turnoverDaysValue: (days: number) => string;
    currency: (value: number) => string;
  };
  form: {
    createTitle: string;
    editTitle: string;
    barcode: string;
    productName: string;
    currentStock: string;
    unitPrice: string;
    seasonalityIndex: string;
    leadTimeDays: string;
    recentShipmentsLegend: string;
    seasonalityPlaceholder: string;
    submitCreate: string;
    submitSave: string;
    cancel: string;
    requiredFields: string;
    nonNegativeInt: (label: string) => string;
    nonNegativeFloat: (label: string) => string;
    fieldLabels: {
      currentStock: string;
      shipmentM1: string;
      shipmentM2: string;
      shipmentM3: string;
      seasonalityIndex: string;
      leadTime: string;
      unitPrice: string;
    };
  };
  status: {
    danger: string;
    normal: string;
    warning: string;
    suggestedOrderLine: (qty: number) => string;
  };
  tooltips: Record<LogisticsTooltipKey, TooltipEntry>;
  guide: {
    title: string;
    adjustedDailyShipment: { label: string; formula: string };
    turnoverDays: { label: string; formula: string };
    alertThreshold: { label: string; formula: string };
    suggestedOrderQty: { label: string; formula: string };
  };
  abc: {
    gradeTitle: (grade: string) => string;
  };
  tooltipAria: (title: string) => string;
}

const ko: TranslationDict = {
  localeLabels: { ko: "한국어", ja: "日本語" },
  languageSelectorAria: "언어 선택",
  dashboard: {
    systemName: "Turnover Management System",
    title: "재고 회전율 · 발주 관리 대시보드",
    subtitle: "SQLite + Prisma · ABC 분석 · 리드타임 반영 3단계 경보",
    logout: "로그아웃",
    registerProduct: "+ 상품 등록",
    closeRegisterForm: "등록 폼 닫기",
    loadingProducts: "상품 목록을 불러오는 중…",
    statOrder: "🔴 발주",
    statNormal: "🟢 적정",
    statWarning: "⚠️ 과다",
    statAGrade: "A등급",
    confirmDelete: "이 상품을 삭제하시겠습니까?",
    errors: {
      fetchFailed: "상품 목록을 불러오지 못했습니다.",
      createFailed: "등록에 실패했습니다.",
      updateFailed: "수정에 실패했습니다.",
      deleteFailed: "삭제에 실패했습니다.",
    },
  },
  search: {
    label: "상품 검색",
    placeholder: "바코드 또는 상품명으로 검색...",
  },
  table: {
    empty:
      "등록된 상품이 없습니다. 상품을 등록하거나 검색 조건을 변경해 보세요.",
    abc: "ABC",
    barcode: "바코드",
    productName: "상품명",
    unitPrice: "단가",
    currentStock: "현재 재고",
    adjustedDailyShipment: "보정 일일출하",
    turnoverDays: "회전율(일)",
    stockStatus: "재고 상태",
    suggestedOrderQty: "추천 발주 수량",
    actions: "관리",
    coreProduct: "핵심품목",
    viewDetail: "상세 보기",
    delete: "삭제",
    pageSizeLabel: "표시 건수",
    pageSizeOption: (size) => `${size}건씩 보기`,
    paginationRange: (start, end, total) =>
      `전체 ${total}건 중 ${start}-${end}`,
    paginationOrdinal: "번째",
    previous: "이전",
    next: "다음",
    sortBy: (label) => `${label} 정렬`,
    turnoverDaysValue: (days) =>
      days >= 999 ? "999+일" : `${Math.round(days)}일`,
    currency: (value) => `₩${value.toLocaleString()}`,
  },
  form: {
    createTitle: "상품 등록",
    editTitle: "상품 수정",
    barcode: "바코드",
    productName: "상품명",
    currentStock: "현재 재고",
    unitPrice: "단가 (원)",
    seasonalityIndex: "보정 계수 (계절성 지수)",
    leadTimeDays: "리드타임 (일)",
    recentShipmentsLegend: "직전 3개월 출하량 (M1 → M3)",
    seasonalityPlaceholder: "성수기 1.5 / 비수기 0.7",
    submitCreate: "등록",
    submitSave: "저장",
    cancel: "취소",
    requiredFields: "바코드와 상품명은 필수입니다.",
    nonNegativeInt: (label) => `${label}은(는) 0 이상의 정수여야 합니다.`,
    nonNegativeFloat: (label) => `${label}은(는) 0 이상의 숫자여야 합니다.`,
    fieldLabels: {
      currentStock: "현재 재고",
      shipmentM1: "M1 출하량",
      shipmentM2: "M2 출하량",
      shipmentM3: "M3 출하량",
      seasonalityIndex: "보정 계수",
      leadTime: "리드타임",
      unitPrice: "단가",
    },
  },
  status: {
    danger: "발주 필요",
    normal: "적정 재고",
    warning: "과다 재고",
    suggestedOrderLine: (qty) =>
      `추천 발주: ${qty.toLocaleString()}개`,
  },
  tooltips: {
    recentShipments: {
      title: "최근 3개월 출하량",
      description:
        "현재 월 기준 직전 3개월간 창고에서 출고된 실적입니다.",
    },
    seasonalityIndex: {
      title: "보정 계수",
      description:
        "성수기/비수기 수요 변화를 반영하는 가중치입니다. (성수기 1.5, 비수기 0.7, 기본값 1.0)",
    },
    leadTime: {
      title: "리드타임",
      description: "주문 후 창고에 입고되기까지 걸리는 총 기간(일수)입니다.",
    },
    turnoverDays: {
      title: "재고 회전율(소진 일수)",
      description:
        "현재 재고로 앞으로 몇 일 동안 버틸 수 있는지 나타내는 지표입니다.",
    },
    suggestedOrderQty: {
      title: "추천 발주 수량",
      description:
        "우리회사 안전 재고 기준(90일+리드타임)을 채우기 위해 지금 주문해야 하는 최적의 수량입니다. 발주 필요 상태면 항상 표시됩니다.",
    },
  },
  guide: {
    title: "물류 지표 계산 가이드",
    adjustedDailyShipment: {
      label: "보정 일일 출하량",
      formula: "= (M1 + M2 + M3) ÷ 3 ÷ 30일 × 보정계수",
    },
    turnoverDays: {
      label: "회전율 (소진 일수)",
      formula: "= 현재 재고 ÷ 보정 일일 출하량",
    },
    alertThreshold: {
      label: "발주 경보 기준",
      formula: "= 90일 + 리드타임 (이하일 때 🔴 발주 필요)",
    },
    suggestedOrderQty: {
      label: "추천 발주 수량",
      formula:
        "= (보정 일일 출하량 × (90일 + 리드타임)) − 현재 재고 (발주 필요 시 표시)",
    },
  },
  abc: {
    gradeTitle: (grade) => `ABC ${grade}등급`,
  },
  tooltipAria: (title) => `${title} 설명`,
};

const ja: TranslationDict = {
  localeLabels: { ko: "한국어", ja: "日本語" },
  languageSelectorAria: "言語選択",
  dashboard: {
    systemName: "Turnover Management System",
    title: "在庫回転率 · 発注管理ダッシュボード",
    subtitle:
      "SQLite + Prisma · ABC分析 · リードタイム反映 3段階アラート",
    logout: "ログアウト",
    registerProduct: "+ 商品登録",
    closeRegisterForm: "登録フォームを閉じる",
    loadingProducts: "商品一覧を読み込み中…",
    statOrder: "🔴 発注",
    statNormal: "🟢 適正",
    statWarning: "⚠️ 過剰",
    statAGrade: "Aランク",
    confirmDelete: "この商品を削除しますか？",
    errors: {
      fetchFailed: "商品一覧を読み込めませんでした。",
      createFailed: "登録に失敗しました。",
      updateFailed: "更新に失敗しました。",
      deleteFailed: "削除に失敗しました。",
    },
  },
  search: {
    label: "商品検索",
    placeholder: "バーコードまたは商品名で検索...",
  },
  table: {
    empty:
      "登録された商品がありません。商品を登録するか、検索条件を変更してください。",
    abc: "ABC",
    barcode: "バーコード",
    productName: "商品名",
    unitPrice: "単価",
    currentStock: "現在在庫",
    adjustedDailyShipment: "補正日次出荷",
    turnoverDays: "回転率(日)",
    stockStatus: "在庫ステータス",
    suggestedOrderQty: "推奨発注数量",
    actions: "操作",
    coreProduct: "コア商品",
    viewDetail: "詳細表示",
    delete: "削除",
    pageSizeLabel: "表示件数",
    pageSizeOption: (size) => `${size}件ずつ表示`,
    paginationRange: (start, end, total) =>
      `全${total}件中 ${start}-${end}件目`,
    paginationOrdinal: "",
    previous: "前へ",
    next: "次へ",
    sortBy: (label) => `${label}で並べ替え`,
    turnoverDaysValue: (days) =>
      days >= 999 ? "999+日" : `${Math.round(days)}日`,
    currency: (value) => `¥${value.toLocaleString()}`,
  },
  form: {
    createTitle: "商品登録",
    editTitle: "商品修正",
    barcode: "バーコード",
    productName: "商品名",
    currentStock: "現在在庫",
    unitPrice: "単価 (円)",
    seasonalityIndex: "補正係数 (季節性指数)",
    leadTimeDays: "リードタイム (日)",
    recentShipmentsLegend: "直近3ヶ月の出荷量 (M1 → M3)",
    seasonalityPlaceholder: "繁忙期 1.5 / 閑散期 0.7",
    submitCreate: "登録",
    submitSave: "保存",
    cancel: "キャンセル",
    requiredFields: "バーコードと商品名は必須です。",
    nonNegativeInt: (label) => `${label}は0以上の整数である必要があります。`,
    nonNegativeFloat: (label) => `${label}は0以上の数値である必要があります。`,
    fieldLabels: {
      currentStock: "現在在庫",
      shipmentM1: "M1 出荷量",
      shipmentM2: "M2 出荷量",
      shipmentM3: "M3 出荷量",
      seasonalityIndex: "補正係数",
      leadTime: "リードタイム",
      unitPrice: "単価",
    },
  },
  status: {
    danger: "発注必要",
    normal: "適正在庫",
    warning: "過剰在庫",
    suggestedOrderLine: (qty) =>
      `推奨発注: ${qty.toLocaleString()}個`,
  },
  tooltips: {
    recentShipments: {
      title: "直近3ヶ月の出荷量",
      description:
        "当月基準の直近3ヶ月間に倉庫から出荷された実績です。",
    },
    seasonalityIndex: {
      title: "補正係数 (季節性指数)",
      description:
        "繁忙期/閑散期の需要変動を反映する重みです。（繁忙期 1.5、閑散期 0.7、デフォルト 1.0）",
    },
    leadTime: {
      title: "リードタイム",
      description:
        "発注後、倉庫に入庫されるまでの合計期間（日数）です。",
    },
    turnoverDays: {
      title: "回転率 (消化日数)",
      description:
        "現在在庫で今後何日間持ちこたえられるかを示す指標です。",
    },
    suggestedOrderQty: {
      title: "推奨発注数量",
      description:
        "当社の安全在庫基準（90日+リードタイム）を満たすために今注文すべき最適数量です。発注必要状態では常に表示されます。",
    },
  },
  guide: {
    title: "物流指標計算ガイド",
    adjustedDailyShipment: {
      label: "補正日次出荷量",
      formula: "= (M1 + M2 + M3) ÷ 3 ÷ 30日 × 補正係数",
    },
    turnoverDays: {
      label: "回転率 (消化日数)",
      formula: "= 現在在庫 ÷ 補正日次出荷量",
    },
    alertThreshold: {
      label: "発注アラート基準",
      formula: "= 90日 + リードタイム（以下の場合 🔴 発注必要）",
    },
    suggestedOrderQty: {
      label: "推奨発注数量",
      formula:
        "= (補正日次出荷量 × (90日 + リードタイム)) − 現在在庫（発注必要時に表示）",
    },
  },
  abc: {
    gradeTitle: (grade) => `ABC ${grade}ランク`,
  },
  tooltipAria: (title) => `${title}の説明`,
};

export const translations: Record<Locale, TranslationDict> = { ko, ja };

export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_STORAGE_KEY = "dashboard-locale";
