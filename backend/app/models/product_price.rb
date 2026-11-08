class ProductPrice < ApplicationRecord
  belongs_to :product
  belongs_to :customer, optional: true
  belongs_to :customer_group, optional: true

  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :effective_from, presence: true
  validate :customer_or_group_present

  scope :current, lambda {
    where("effective_from <= ? AND (effective_to IS NULL OR effective_to > ?)", Time.current, Time.current)
  }

  private

  def customer_or_group_present
    return if customer_id.present? ^ customer_group_id.present?

    errors.add(:base, "Specify either a customer or a customer group, not both or neither")
  end
end
