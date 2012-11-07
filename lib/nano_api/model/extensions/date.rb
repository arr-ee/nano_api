# encoding: UTF-8
module NanoApi
  module Model
    module Extensions
      module Date
        extend ActiveSupport::Concern

        def demodelize
          to_s
        end

        module ClassMethods
          def modelize value
            smart_parse(value.to_s) rescue nil
          end

          def smart_parse date_or_string, fallback = nil
            fallback_value = fallback.respond_to?(:call) ? fallback.call : fallback
            if date_or_string.is_a?(String) && match = date_or_string.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
              date_or_string = [match[3], match[2], match[1]].join ?/
            end

            date = case date_or_string
                   when String
                     string = date_or_string.strip.gsub(/\s+/, '.').mb_chars.downcase
                     begin
                       string.to_date
                     rescue TypeError, NoMethodError
                       I18n.t('date.month_names').each_with_index do |month, index|
                         next if month.nil?
                         if string.include?(month)
                           string.gsub!(month, index.to_s.rjust(2, '0'))
                         end
                       end

                       string.to_date rescue fallback_value
                     end
                   else
                     date_or_string
                   end

            date or fallback_value
          end
        end
      end
    end
  end
end

Date.send :include, NanoApi::Model::Extensions::Date
