'use client';

import { useState } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length - 1]) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    if (nameParts[0]) {
      return nameParts[0][0];
    }
    return '';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpdate = async () => {
    if (!newAvatarFile || !user) return;

    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user.uid}/${newAvatarFile.name}`);
      
      const snapshot = await uploadBytes(storageRef, newAvatarFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, { photoURL: downloadURL });

      // Update Firestore user document
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });

      toast({
        title: 'Success!',
        description: 'Your avatar has been updated.',
      });

      setNewAvatarFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Profile
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Manage your personal information and profile picture.
      </p>

      <Card className="mt-8 max-w-2xl">
        <CardHeader>
          <CardTitle>Update Your Avatar</CardTitle>
          <CardDescription>
            This image will be displayed on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              {previewUrl ? (
                 <Image src={previewUrl} alt="Avatar Preview" width={96} height={96} className="aspect-square h-full w-full object-cover" />
              ) : user.photoURL ? (
                <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />
              ) : (
                <AvatarFallback className="text-3xl">
                  {getInitials(user.displayName) || <UserIcon />}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input id="avatar-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
            </div>
          </div>
          
          {previewUrl && (
             <Button onClick={handleAvatarUpdate} disabled={isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? 'Uploading...' : 'Update Avatar'}
            </Button>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
