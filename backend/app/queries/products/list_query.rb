module Products
  class ListQuery
    def initialize(search: nil, active: true)
      @search = search
      @active = active
    end

    def call
      scope = Product.includes(:product_category, :product_unit).order(:name)
      scope = scope.where(active: true) if @active
      if @search.present?
        term = "%#{@search.strip}%"
        scope = scope.where("name ILIKE :t OR product_code ILIKE :t", t: term)
      end
      scope
    end
  end
end
