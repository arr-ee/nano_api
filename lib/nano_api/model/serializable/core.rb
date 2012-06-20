Array.class_eval do
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

Hash.class_eval do
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

Integer.class_eval do
  def self.modelize value
    value.try(:to_i) if value.to_s =~ /\A\d+\Z/
  end

  def self.demodelize value
    value.to_s
  end
end

String.class_eval do
  def self.modelize value
    value.to_s if value.present?
  end

  def self.demodelize value
    value
  end
end

Date.class_eval do
  def self.modelize value
    Date.parse(value.to_s) rescue nil
  end

  def self.demodelize value
    value.to_s
  end
end
