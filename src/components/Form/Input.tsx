import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface InputFieldProps {
  control: any
  name: string
  label: string
  placeholder?: string
  description?: string
}

export function InputField({
  control,
  name,
  label,
  placeholder,
  description,
}: InputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full gap-[3px]">
          <FormLabel className="text-[16px] font-medium">{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
