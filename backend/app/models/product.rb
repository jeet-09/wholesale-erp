class Product < ApplicationRecord
  belongs_to :product_category
  belongs_to :product_unit
  has_many :product_prices, dependent: :destroy

  validates :name, :product_code, presence: true
  validates :product_code, uniqueness: { case_sensitive: false }
  validates :default_selling_price, :purchase_price, :stock_quantity,
            numericality: { greater_than_or_equal_to: 0 }

  before_validation :normalize_code

  scope :active, -> { where(active: true) }

  private

  def normalize_code
    self.product_code = product_code.to_s.strip.upcase
  end
end
