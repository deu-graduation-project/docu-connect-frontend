import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
type Props = {};
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export default function SignUp({}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-5 left-5">
        <Link href={"/"}>
          <Icons.arrowLeft strokeWidth={"1.3px"} />
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>
            Lütfen bilgilerinizi doldurup kayıt olun
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p>Adınızı Giriniz</p>
            <Input type="text" placeholder="Adınızı giriniz" />
          </div>
          <div className="flex flex-col gap-2">
            <p>Soyadınızı Giriniz</p>
            <Input type="text" placeholder="Soyadınızı giriniz" />
          </div>
          <div className="flex flex-col gap-2">
            <p>Emailinizi Giriniz</p>
            <Input type="email" placeholder="Emailinizi giriniz" />
          </div>
          <div className="flex flex-col gap-2">
            <p>Şifrenizi Giriniz</p>
            <Input type="password" placeholder="Şifrenizi giriniz" />
          </div>
          <div className="flex flex-col gap-4">
            <Button className="w-full">Kayıt Ol</Button>
            <Button
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              <Icons.google />
              Google ile Kayıt Ol
            </Button>
          </div>
          <div className="flex w-full gap-2 justify-center">
            <p>Hesabınız var mı?</p>
            <Link href={"/sign-in"} className="underline">
              Giriş Yap
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
