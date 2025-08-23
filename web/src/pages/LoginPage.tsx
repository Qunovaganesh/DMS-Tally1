import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const response = await api.login(data.email, data.password)
      setAuth(response.token, response.user)
      toast.success('Login successful')
    } catch (error) {
      toast.error('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mac-traffic-lights justify-center mb-4">
            <div className="mac-traffic-light red"></div>
            <div className="mac-traffic-light yellow"></div>
            <div className="mac-traffic-light green"></div>
          </div>
          <CardTitle className="text-2xl">BizzPlus DMS</CardTitle>
          <p className="text-text-secondary">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register('email')}
                type="email"
                placeholder="Email"
                className={errors.email ? 'border-danger' : ''}
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Input
                {...register('password')}
                type="password"
                placeholder="Password"
                className={errors.password ? 'border-danger' : ''}
              />
              {errors.password && (
                <p className="text-danger text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-border/30 rounded-xl">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1 text-text-secondary">
              <div>Admin: admin@demo.com / 123456</div>
              <div>Manufacturer: manu@demo.com / 123456</div>
              <div>Distributor: dist@demo.com / 123456</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}