module CustomerGroups
  class UpdateService < ApplicationService
    def initialize(group:, params:)
      @group = group
      @params = params
    end

    def call
      if @group.update(@params)
        success(Api::V1::CustomerGroupSerializer.new(@group).as_json)
      else
        failure(@group.errors.full_messages)
      end
    end
  end
end
