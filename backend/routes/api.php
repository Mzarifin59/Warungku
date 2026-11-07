<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;

// AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// PROTECTED API
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);

    // STORE
    Route::apiResource('/stores', StoreController::class);

    // CATEGORY
    Route::get('/stores/{storeId}/categories', [CategoryController::class, 'index']);
    Route::post('/stores/{storeId}/categories', [CategoryController::class, 'store']);

    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // PRODUCT
    Route::get('/stores/{storeId}/products', [ProductController::class, 'index']);
    Route::post('/stores/{storeId}/products', [ProductController::class, 'store']);

    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});