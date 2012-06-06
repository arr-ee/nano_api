Integer.class_eval do

  def self.modelize value
    value.try(:to_i) if value.to_s =~ /\A\d+\Z/
  end

  def self.demodelize value
    value.to_s
  end

end
