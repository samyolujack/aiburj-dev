package model

// Ticket 工单反馈
type Ticket struct {
	Id          int    `json:"id" gorm:"primaryKey;autoIncrement"`
	UserId      int    `json:"user_id" gorm:"not null;index"`
	Type        string `json:"type" gorm:"size:32;not null;default:bug"`
	Subject     string `json:"subject" gorm:"size:255;not null"`
	Description string `json:"description" gorm:"type:text;not null"`
	Contact     string `json:"contact" gorm:"size:255"`
	Status      string `json:"status" gorm:"size:32;not null;default:open"`
	CreatedAt   int64  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   int64  `json:"updated_at" gorm:"autoUpdateTime"`
}

func (Ticket) TableName() string {
	return "tickets"
}

// CreateTicket inserts a new ticket
func CreateTicket(ticket *Ticket) error {
	return DB.Create(ticket).Error
}

// GetUserTickets returns tickets for a user
func GetUserTickets(userId int, page, size int) ([]Ticket, int64, error) {
	var tickets []Ticket
	var total int64
	err := DB.Model(&Ticket{}).Where("user_id = ?", userId).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * size
	err = DB.Where("user_id = ?", userId).
		Order("created_at DESC").
		Offset(offset).Limit(size).
		Find(&tickets).Error
	return tickets, total, err
}

// GetAllTickets returns all tickets with pagination and optional filters
func GetAllTickets(page, size int, status, ticketType string) ([]Ticket, int64, error) {
	var tickets []Ticket
	var total int64
	q := DB.Model(&Ticket{})
	if status != "" {
		q = q.Where("status = ?", status)
	}
	if ticketType != "" {
		q = q.Where("type = ?", ticketType)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * size
	err := q.Order("created_at DESC").Offset(offset).Limit(size).Find(&tickets).Error
	return tickets, total, err
}

// UpdateTicketStatus updates a ticket's status
func UpdateTicketStatus(id int, status string) error {
	return DB.Model(&Ticket{}).Where("id = ?", id).Update("status", status).Error
}

// GetTicketByID returns a single ticket
func GetTicketByID(id int) (*Ticket, error) {
	var ticket Ticket
	err := DB.Where("id = ?", id).First(&ticket).Error
	if err != nil {
		return nil, err
	}
	return &ticket, nil
}
