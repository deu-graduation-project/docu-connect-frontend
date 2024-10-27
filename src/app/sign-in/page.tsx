import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
type Props = {}
import { cn } from "@/lib/utils";


export default function SignIn({}: Props) {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <Card>
        <CardHeader>
            <CardTitle>Giriş Yapınız</CardTitle>
            <CardDescription>Uygun boşlukları doldurup giriş yapınız</CardDescription>
        </CardHeader>
        <CardContent className='p-4 flex flex-col gap-6'>
            <div className="flex flex-col gap-2 gap-x-2">
                <p>Emailinizi Giriniz</p>
                <Input type="email" placeholder="Emailinizi giriniz" />
            </div>
            <div className="flex flex-col gap-2 gap-x-2">
                <div className="flex w-full justify-between">
                    <p>Şifrenizi Gİriniz</p>
                    <Link href={"#"} className='text-sm'>
                    Şifremi Unuttum?
                    </Link>
                </div> 
                <Input type="email" placeholder="Emailinizi giriniz" />
            </div>
            <div className="flex flex-col gap-4">
                <Button className='w-full'>
                    Giriş Yap
                </Button>
                <Button className={cn(buttonVariants({variant: "secondary"}) ,"w-full")}>
                    Google İle Giriş Yap
                </Button>
            </div>
            <div className="flex w-full gap-2">
                <p>Hesabınız yok mu?</p>
                <Link href={"/sign-up"}className='underline'>Kayıt Ol</Link>
            
            </div>
        </CardContent>
            
        </Card>

    </div>
  )
}