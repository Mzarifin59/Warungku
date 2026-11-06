<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Store extends Model
{
    use HasUuids;

    protected $fillable = [
        'owner_id',
        'slug',
        'name',
        'description',
        'whatsapp_number',
        'logo_path',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(Profile::class, 'owner_id');
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}