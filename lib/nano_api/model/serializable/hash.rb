class NanoApi::Model::Serializable::Hash

  def self.modelize value
    case value
    when Hash then
      value
    else
      nil
    end
  end

  def self.demodelize value
    nil
  end

end
