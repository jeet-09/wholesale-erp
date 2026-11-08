module Api
  module V1
    class CustomerGroupSerializer
      def initialize(group)
        @group = group
      end

      def as_json
        {
          id: @group.id,
          name: @group.name,
          code: @group.code,
          abbreviation: @group.abbreviation,
          notes: @group.notes,
          active: @group.active,
          branches_count: @group.customers.count
        }
      end
    end
  end
end
