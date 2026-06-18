package model

// Invoice 发票申请
type Invoice struct {
	Id        int     `json:"id" gorm:"primaryKey;autoIncrement"`
	UserId    int     `json:"user_id" gorm:"not null;index"`
	Type      string  `json:"type" gorm:"size:32;not null;default:personal"`
	Title     string  `json:"title" gorm:"size:255;not null"`
	TaxId     string  `json:"tax_id" gorm:"size:64"`
	Amount    float64 `json:"amount" gorm:"not null"`
	Email     string  `json:"email" gorm:"size:255"`
	Remark    string  `json:"remark" gorm:"type:text"`
	Status    string  `json:"status" gorm:"size:32;not null;default:pending"`
	CreatedAt int64   `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt int64   `json:"updated_at" gorm:"autoUpdateTime"`
}

func (Invoice) TableName() string {
	return "invoices"
}

// CreateInvoice inserts a new invoice request
func CreateInvoice(invoice *Invoice) error {
	return DB.Create(invoice).Error
}

// GetUserInvoices returns invoices for a user
func GetUserInvoices(userId int, page, size int) ([]Invoice, int64, error) {
	var invoices []Invoice
	var total int64
	err := DB.Model(&Invoice{}).Where("user_id = ?", userId).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * size
	err = DB.Where("user_id = ?", userId).
		Order("created_at DESC").
		Offset(offset).Limit(size).
		Find(&invoices).Error
	return invoices, total, err
}
