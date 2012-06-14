class NanoApi::Model::Serializable::Array

  def self.modelize value
    case value
    when String then
      value.split(',').map(&:strip)
    when Array then
      value
    else
      nil
    end
  end

  def self.demodelize value
    value.join(', ')
  end

end
