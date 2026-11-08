class CustomerGroup < ApplicationRecord
  has_many :customers, dependent: :restrict_with_error
  has_many :product_prices, dependent: :destroy

  validates :name, :code, presence: true
  validates :code, uniqueness: { case_sensitive: false }

  before_validation :normalize_code

  scope :active, -> { where(active: true) }

  private

  def normalize_code
    self.code = code.to_s.strip.upcase
  end
end
