"use client";
import React from "react";
import { Icons } from "@/components/icons";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuthStatus from "../../../lib/queries/auth-status";
import withAuth from "@/components/with-auth";

const ProfilePage = () => {
  const { data, isLoading, error } = useAuthStatus();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data?.isAuthenticated) {
    return <div>Please log in to view this content.</div>;
  }

  return (
    <div className=" pb-12">
      <div className=" h-64 w-full relative ">
        <div className="relative h-full w-full bg-background">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_2px,transparent_2px),linear-gradient(to_bottom,#4f4f4f2e_2px,transparent_2px)] bg-[size:24px_36px] [mask-image:radial-gradient(background,transparent_95%)]"></div>
        </div>
        <div className="flex items-center justify-center">
          <div className="bg-background border absolute w-48 h-48 rounded-full ">
            <div className="absolute w-8 h-8 border bg-secondary  right-0 bottom-8 rounded-full">
              <button className="flex items-center justify-center h-full w-full">
                <Icons.camera className="bg-transparent   w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-32 flex items-center justify-center">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-xl font-semibold ">{data.username}</h1>
          <p className="text-muted-foreground text-sm">{data.email}</p>
          <div className="flex justify-center gap-4 pt-3">
            <div className="flex items-center justify-center gap-1">
              <h1 className="font-semibold">259</h1>
              <p className="text-muted-foreground text-sm">Posts</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <h1 className="font-semibold">129K</h1>
              <p className="text-muted-foreground text-sm">Followers</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <h1 className="font-semibold">2K</h1>
              <p className="text-muted-foreground text-sm">Following</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center py-6 justify-center flex-col">
        <h1 className="text-base font-semibold ">About Me</h1>
        <p className="text-center max-w-2xl px-4 py-2 text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque unde
          expedita sapiente autem dicta sit quam, necessitatibus earum laborum
          rerum deleniti perspiciatis asperiores qui voluptas numquam
          recusandae, facilis ipsum et.
        </p>
      </div>

      <div className="flex items-center justify-center flex-col">
        <h1 className="text-base font-semibold ">Follow me on</h1>
        <div className="flex justify-center py-4 gap-4">
          <button>
            <Icons.twitter className="w-6 h-6 cursor-pointer" />
          </button>
          <button>
            <Icons.facebook className="w-6 h-6 cursor-pointer" />
          </button>
          <button>
            <Icons.instagram className="w-6 h-6 cursor-pointer" />
          </button>
          <button>
            <Icons.linkedin className="w-6 h-6 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);
