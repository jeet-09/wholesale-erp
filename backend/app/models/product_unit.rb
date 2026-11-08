class ProductUnit < ApplicationRecord
  has_many :products, dependent: :restrict_with_error

  validates :name, :abbreviation, presence: true
  validates :name, uniqueness: true

  scope :active, -> { where(active: true) }
end
