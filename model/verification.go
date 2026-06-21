package model

// UserVerification 实名认证信息（独立表，ID号加密存储）
type UserVerification struct {
	Id          int    `json:"id" gorm:"primaryKey;autoIncrement"`
	UserId      int    `json:"user_id" gorm:"not null;uniqueIndex"`
	RealName    string `json:"real_name" gorm:"size:64;not null"`
	IdNumber    string `json:"-" gorm:"size:256;not null"` // 加密存储，JSON不输出
	IdCardFront string `json:"id_card_front" gorm:"size:512"` // 身份证正面照URL
	IdCardBack  string `json:"id_card_back" gorm:"size:512"`  // 身份证背面照URL
	Status      int    `json:"status" gorm:"not null;default:0"` // 0=待审核 1=已通过 2=已拒绝
	ReviewMsg   string `json:"review_msg" gorm:"size:512"`       // 审核意见
	CreatedAt   int64  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   int64  `json:"updated_at" gorm:"autoUpdateTime"`
	ReviewedAt  int64  `json:"reviewed_at" gorm:"default:0"`
}

func (UserVerification) TableName() string {
	return "user_verifications"
}

// GetVerificationByUserId returns the verification record for a user
func GetVerificationByUserId(userId int) (*UserVerification, error) {
	var v UserVerification
	err := DB.Where("user_id = ?", userId).First(&v).Error
	if err != nil {
		return nil, err
	}
	return &v, nil
}

// CreateVerification inserts a new verification request
func CreateVerification(v *UserVerification) error {
	return DB.Create(v).Error
}

// UpdateVerificationStatus updates the review status
func UpdateVerificationStatus(id int, status int, reviewMsg string) error {
	return DB.Model(&UserVerification{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status":     status,
		"review_msg": reviewMsg,
	}).Error
}
