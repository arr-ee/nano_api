class NanoApi::Model::Serializable::String

  def self.modelize value
    value.to_s if value.present?
  end

  def self.demodelize value
    value
  end

end
