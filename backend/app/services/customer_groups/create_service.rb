module CustomerGroups
  class CreateService < ApplicationService
    def initialize(params:)
      @params = params
    end

    def call
      group = CustomerGroup.new(@params)
      if group.save
        success(Api::V1::CustomerGroupSerializer.new(group).as_json)
      else
        failure(group.errors.full_messages)
      end
    end
  end
end
