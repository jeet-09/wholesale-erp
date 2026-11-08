# Base class for command-style service objects.
# Subclasses implement #call and return ApplicationService::Result.
class ApplicationService
  Result = Struct.new(:success, :data, :errors, keyword_init: true) do
    def success?
      success
    end

    def failure?
      !success
    end
  end

  def self.call(...)
    new(...).call
  end

  private

  def success(data = nil)
    Result.new(success: true, data: data, errors: [])
  end

  def failure(errors)
    normalized = Array(errors).map do |err|
      err.is_a?(Hash) ? err : { code: "error", message: err.to_s }
    end
    Result.new(success: false, data: nil, errors: normalized)
  end
end
