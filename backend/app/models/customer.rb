class Customer < ApplicationRecord
  CUSTOMER_TYPES = %w[individual branch].freeze
  BALANCE_TYPES = %w[debit credit].freeze

  belongs_to :customer_group, optional: true
  has_many :product_prices, dependent: :destroy

  validates :restaurant_name, :account_name, :customer_code, :abbreviation, presence: true
  validates :customer_code, uniqueness: { case_sensitive: false }
  validates :abbreviation, uniqueness: { case_sensitive: false }
  validates :customer_type, inclusion: { in: CUSTOMER_TYPES }
  validates :balance_type, inclusion: { in: BALANCE_TYPES }
  validate :branch_requires_group

  before_validation :normalize_codes

  scope :active, -> { where(active: true) }

  private

  def normalize_codes
    self.customer_code = customer_code.to_s.strip.upcase
    self.abbreviation = abbreviation.to_s.strip.upcase
  end

  def branch_requires_group
    return unless customer_type == "branch"

    errors.add(:customer_group, "must be present for branch customers") if customer_group_id.blank?
  end
end
