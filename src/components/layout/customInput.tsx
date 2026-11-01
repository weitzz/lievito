import { ComponentProps } from 'react'
import { Input } from '../ui/input'
import { checkFieldError } from '@/lib/utils'
type PropsInput = ComponentProps<"input"> & {
    name: string
    errors: any
}

export const CustomInput = (props: PropsInput) => {
    const error = checkFieldError(props.name, props.errors)
    return (
        <>
            <Input {...props} className={`${error ? " border border-destructive" : ""}`} />
            {error &&
                <span className='mt-1 text-sm text-destructive'>{error}</span>
            }
        </>
    )
}
