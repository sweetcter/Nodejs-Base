export enum Discount {
    PERCENT = 'percent',
    FIXED = 'fixed',
}

export enum ProductStatus {
    NEW = 'new',
    BEST_SELLER = 'best seller',
    FEATURED = 'featured',
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    OUT_FOR_DELIVERY = 'out for delivery',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    DONE = 'done',
}

export enum TransactionStatus {
    PENDING = 'pending',
    SUCCESSFULLY = 'successfully',
    FAILED = 'failed',
}

export enum CouponApplyTo {
    All = 'all',
    Category = 'category',
}

export enum CouponUseFor {
    People = 'people',
    Person = 'person',
}

export enum CouponDiscountType {
    Percentage = 'percentage',
    Fixed = 'fixed',
}

export enum ProductLanguage {
    English = 'english',
    Vietnamese = 'vietnamese',
}
