"use client";

import React, { useEffect } from "react";

import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { api } from "~/trpc/react";

import { CoreEntityCreateSchema, type AttributeValueSchema } from "~/schemas";
import type { CoreEntityBlueprint } from "~/types";

import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";

export default function EntityForm({
  blueprint,
}: {
  blueprint: CoreEntityBlueprint;
}) {
  const form = useForm<z.infer<typeof CoreEntityCreateSchema>>({
    resolver: zodResolver(CoreEntityCreateSchema),
  });

  useEffect(() => {
    form.reset({
      blueprintId: blueprint.id,
      values: blueprint.attributes?.map(
        (attribute) =>
          ({
            attributeId: attribute?.attribute?.id,
            type: attribute?.attribute?.valueType ?? "STRING",
            value: "",
          }) satisfies z.infer<typeof AttributeValueSchema>,
      ),
    } satisfies z.infer<typeof CoreEntityCreateSchema>);
  }, [form, blueprint]);

  const { isPending, mutate } = api.coreEntity.create.useMutation();

  const onSubmit = (values: z.infer<typeof CoreEntityCreateSchema>) => {
    console.log("Submit: ", values);

    mutate(values);

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {blueprint.attributes?.map((attribute, index) => (
          <FormField
            key={attribute.attribute?.id}
            control={form.control}
            name={`values.${index}`}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{attribute?.attribute?.name}</FormLabel>
                  <FormControl>
                    <Input
                      ref={field.ref}
                      name={field.name}
                      onChange={(e) =>
                        field.onChange({
                          attributeId: field.value.attributeId,
                          type: field.value.type,
                          value: JSON.stringify(e.target.value),
                        })
                      }
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    {attribute?.attribute?.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}
        <Button type="submit" disabled={isPending}>
          Create
        </Button>
      </form>
    </Form>
  );
}
