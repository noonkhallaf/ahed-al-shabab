import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, Trash2 } from 'lucide-react';

export default function AdminMedia() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">مكتبة الصور</h2>
        <Button><Upload className="h-4 w-4 ml-2" />رفع صورة</Button>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">مكتبة الوسائط</p>
          <p className="text-sm text-muted-foreground">
            لتفعيل رفع الصور والملفات، يُنصح بربط الموقع بقاعدة بيانات سحابية.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            حاليًا يمكنك إضافة الصور من خلال روابط URL في أقسام المرشحين والأخبار.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
