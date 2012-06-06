class NanoApi::Model::Serializable::Boolean

  def self.modelize value
    if NanoApi::Model::TRUE_VALUES.include?(value)
      true
    elsif NanoApi::Model::FALSE_VALUES.include?(value)
      false
    end
  end

  def self.demodelize value
    value ? 1 : 0
  end

end
